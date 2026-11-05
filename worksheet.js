const handwritingWorksheet = (() => {
  "use strict";

  const { lineStrokes, shapeText, wrapRows } = handwritingLettering;

  const paperSizes = {
    portrait: { width: 210, height: 297, orientation: "portrait" },
    landscape: { width: 297, height: 210, orientation: "landscape" },
  };
  const tracePatterns = { dotted: "0.15 2.35", dashed: "2.7 1.7" };

  const margin = 12;
  const rowHeight = 13;
  const secondModelRowHeight = 12;
  const minUnruledRowHeight = 10;
  const unruledHeadingHeight = 5;
  const secondPageHeightPerLine = 2 * (secondModelRowHeight + minUnruledRowHeight);
  const bodyScale = 0.435;
  const sectionHeading = 8;
  const titleHeight = 11;
  const headerTop = margin + titleHeight;
  const svgNamespace = "http://www.w3.org/2000/svg";

  function layoutWorksheet({ text, style, orientation, name, date, secondPage }) {
    const paper = paperSizes[orientation];
    const width = paper.width - 2 * margin;
    const splitFields = name !== null && date !== null;
    const fieldGap = 7;
    const nameWidth = splitFields ? Math.round((width - fieldGap) * 0.39) : width;
    const fieldScale = splitFields ? 0.41 : 0.43;
    const maxFieldRows = splitFields && orientation === "portrait" ? 2 : 1;
    const fields = [];
    const errors = {};
    let y = headerTop;

    for (const [key, value] of [["name", name], ["date", date]]) {
      if (value === null) continue;
      const secondColumn = splitFields && key === "date";
      const x = secondColumn ? margin + nameWidth + fieldGap : margin;
      const fieldWidth = secondColumn ? width - nameWidth - fieldGap : nameWidth;
      const { rows, unsupported } = shapeText(value, style);
      const traceRows = rows && value.trim() ? wrapRows(rows, (fieldWidth - 5) / fieldScale) : [];
      if (unsupported) {
        errors[key] = `There’s no handwriting model for “${unsupported}”.`;
      } else if (traceRows.length > maxFieldRows) {
        errors[key] = `Shorten the ${key} so it fits on ${maxFieldRows === 1 ? "one line" : "two lines"}.`;
      }
      const copyRows = traceRows.length || (key === "date" ? maxFieldRows : 1);
      fields.push({ key, traceRows, copyRows, x, width: fieldWidth, scale: fieldScale });
      y = Math.max(y, headerTop + sectionHeading + rowHeight * (traceRows.length + copyRows));
    }

    const practiceBottom = paper.height - margin - 3 * sectionHeading;
    const available = practiceBottom - y;
    const secondAvailable = practiceBottom - headerTop;
    const firstLimit = Math.floor(available / (3 * rowHeight));
    // The second page needs room for the model, trace, at least one ruled
    // row, and two complete unguided copies.
    const secondLimit = Math.floor((secondAvailable - unruledHeadingHeight - rowHeight) / secondPageHeightPerLine);
    const maxLines = secondPage ? Math.min(firstLimit, secondLimit) : firstLimit;
    const shaped = shapeText(text, style);
    const lines = shaped.rows && wrapRows(shaped.rows, (width - 5) / bodyScale);
    if (!text.trim()) errors.text = "Enter some text to practise.";
    else if (shaped.unsupported) errors.text = `There’s no handwriting model for “${shaped.unsupported}”.`;
    else if (lines.length > maxLines) errors.text = `Shorten the passage to ${maxLines} ${maxLines === 1 ? "line" : "lines"} so there’s room to copy it.`;

    const lineCount = lines?.length ?? 0;
    const freeRows = Math.max(0, Math.floor(available / rowHeight) - 2 * lineCount);
    const unruledCopies = secondPage || !lineCount ? 0 : Math.max(0, Math.min(2, Math.floor((freeRows - 1) / (2 * lineCount))));
    const pages = [{
      fields, y, modelRowHeight: rowHeight, showUnruled: unruledCopies > 0,
      ruledRows: freeRows - unruledCopies * lineCount,
    }];
    if (secondPage) {
      const writingHeight = secondAvailable - 2 * lineCount * secondModelRowHeight - unruledHeadingHeight;
      const unruledHeight = Math.max(0, Math.min(2 * lineCount * rowHeight, writingHeight - rowHeight));
      pages.push({
        fields: [], y: headerTop, modelRowHeight: secondModelRowHeight, showUnruled: true,
        ruledRows: Math.max(0, Math.floor((writingHeight - unruledHeight) / rowHeight)),
      });
    }
    return { paper, width, style, text: text.trim(), lines, maxLines, errors, pages };
  }

  function element(parent, name, attributes = {}, text) {
    const node = parent.ownerDocument.createElementNS(svgNamespace, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text;
    parent.append(node);
    return node;
  }

  function label(parent, x, y, text, title = false) {
    element(parent, "text", {
      x, y, fill: "#232627", "font-family": "Arial, sans-serif",
      "font-size": title ? 4.6 : 3.05, "font-weight": title ? 700 : 600,
    }, text);
  }

  function guide(parent, x, y, width, offset, colour, dash) {
    element(parent, "line", {
      x1: x, x2: x + width, y1: y + offset, y2: y + offset,
      stroke: colour, "stroke-width": 0.24, ...(dash && { "stroke-dasharray": dash }),
    });
  }

  function practiceRow(parent, x, y, width, style, line, traceDash, scale = bodyScale, guides = true) {
    const row = element(parent, "g", { "data-row": traceDash ? "trace" : line ? "model" : "blank" });
    const baseline = y + 9.7;
    if (guides) {
      guide(row, x, baseline, width, -15 * scale, "#b6bfc0");
      guide(row, x, baseline, width, -10 * scale, "#adb9ba", "0.9 0.8");
    }
    guide(row, x, baseline, width, 0, "#748384");
    if (!line) return;
    const writing = element(row, "g", {
      transform: `translate(${x + 2} ${baseline}) scale(${scale})`, fill: "none",
      stroke: traceDash ? "#616d70" : "#202526", "stroke-width": traceDash ? 1.05 : 1.34,
      "stroke-linecap": "round", "stroke-linejoin": "round",
      ...(traceDash && { "stroke-dasharray": traceDash }),
    });
    for (const { path, transform } of lineStrokes(line, style)) {
      element(writing, "path", { d: path, ...(transform && { transform }) });
    }
  }

  function renderPage(document, layout, page, traceDash, pageNumber) {
    const { paper, width, style, text, lines, pages } = layout;
    const { fields, ruledRows, showUnruled, modelRowHeight } = page;
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", `0 0 ${paper.width} ${paper.height}`);
    svg.setAttribute("width", `${paper.width}mm`);
    svg.setAttribute("height", `${paper.height}mm`);
    svg.setAttribute("class", "worksheet");
    svg.setAttribute("role", "img");
    const pageLabel = pages.length > 1 ? ` Page ${pageNumber} of ${pages.length}.` : "";
    svg.setAttribute("aria-label", `Handwriting practice worksheet.${pageLabel} Model and tracing text: ${text}`);
    label(svg, margin, margin + 5, "Handwriting practice", true);

    for (const { key, traceRows, copyRows, x, width: fieldWidth, scale } of fields) {
      const field = element(svg, "g", { "data-section": key });
      label(field, x, headerTop + 4, key === "name" ? "Name" : "Date");
      let fieldY = headerTop + sectionHeading - 3;
      for (const line of traceRows) {
        practiceRow(field, x, fieldY, fieldWidth, style, line, traceDash, scale);
        fieldY += rowHeight;
      }
      for (let row = 0; row < copyRows; row++) {
        practiceRow(field, x, fieldY, fieldWidth, style, null, null, scale, traceRows.length > 0);
        fieldY += rowHeight;
      }
    }

    let y = page.y;
    for (const [key, heading] of [["model", "1. Read the model"], ["trace", "2. Trace the letters"], ["practise", "3. Write it yourself"]]) {
      const section = element(svg, "g", { "data-section": key });
      label(section, margin, y + 4, heading);
      y += sectionHeading;
      const practice = key === "practise";
      const rows = practice ? Array(ruledRows).fill(null) : lines;
      for (const row of rows) {
        practiceRow(section, margin, y, width, style, row, key === "trace" ? traceDash : null);
        y += practice ? rowHeight : modelRowHeight;
      }
    }
    if (showUnruled) {
      const free = element(svg, "g", { "data-section": "unruled" });
      label(free, margin, y + 4, pages.length > 1 ? "Write it twice without guides" : "Try again without guides");
    }
    return svg;
  }

  function renderWorksheet(document, layout, tracing) {
    const traceDash = tracePatterns[tracing];
    return layout.pages.map((page, index) => renderPage(document, layout, page, traceDash, index + 1));
  }

  function printStyles(paper) {
    // A fraction of a millimetre accommodates print engines that round A4 down.
    return `
      @page { size: A4 ${paper.orientation}; margin: 0; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
        body > :not(.print-sheet) { display: none !important; }
        .print-sheet { display: block; width: ${paper.width}mm; margin: 0; }
        .print-sheet .worksheet {
          display: block; margin: 0; border: 0; box-shadow: none; max-width: none;
          width: ${paper.width - 0.25}mm; height: ${paper.height - 0.25}mm;
          break-inside: avoid;
        }
        .print-sheet .worksheet + .worksheet { break-before: page; }
      }`;
  }

  return { layoutWorksheet, printStyles, renderWorksheet };
})();
