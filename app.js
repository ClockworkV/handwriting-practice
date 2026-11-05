(() => {
  "use strict";

  const { layoutWorksheet, printStyles, renderWorksheet } = handwritingWorksheet;

  const form = document.querySelector("#settings");
  const passage = document.querySelector("#passage");
  const name = document.querySelector("#pupil-name");
  const date = document.querySelector("#date");
  const includeName = document.querySelector("#include-name");
  const includeDate = document.querySelector("#include-date");
  const today = document.querySelector("#today");
  const preview = document.querySelector("#preview");
  const paperLabel = document.querySelector("#paper-label");
  const printSheet = document.querySelector(".print-sheet");
  const openPreview = document.querySelector("#open-preview");
  const print = document.querySelector("#print");
  const popupNote = document.querySelector("#popup-note");
  const printStyle = document.createElement("style");
  document.head.append(printStyle);

  const ukDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", day: "numeric", month: "long", year: "numeric",
  });
  let manualDate = "";

  function updateDate() {
    if (today.checked && !date.readOnly) manualDate = date.value;
    if (today.checked) date.value = ukDate.format(new Date());
    else if (date.readOnly) date.value = manualDate;
    date.readOnly = today.checked;
  }

  function showError(input, id, error) {
    document.querySelector(id).textContent = error ?? "";
    if (error) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function update() {
    updateDate();
    document.querySelector("#name-settings").hidden = !includeName.checked;
    document.querySelector("#date-settings").hidden = !includeDate.checked;
    const orientation = form.elements.orientation.value;
    const layout = layoutWorksheet({
      orientation,
      style: form.elements.lettering.value,
      text: passage.value,
      name: includeName.checked ? name.value : null,
      date: includeDate.checked ? date.value : null,
      secondPage: form.elements.secondPage.checked,
    });
    showError(passage, "#passage-error", layout.errors.text);
    showError(name, "#name-error", layout.errors.name);
    showError(date, "#date-error", layout.errors.date);
    document.querySelector("#passage-space").textContent = layout.lines && passage.value.trim()
      ? `${layout.lines.length} of ${layout.maxLines} available model lines used`
      : `${layout.maxLines} model lines available`;
    paperLabel.textContent = paperDescription(layout.paper, layout.pages.length);
    const valid = Object.keys(layout.errors).length === 0;
    openPreview.disabled = print.disabled = !valid;
    printStyle.textContent = printStyles(layout.paper);
    if (!valid) {
      const message = document.createElement("p");
      message.className = "empty-preview";
      message.textContent = "Check the worksheet settings to see a preview.";
      preview.replaceChildren(message);
      printSheet.replaceChildren();
      return null;
    }
    const sheets = renderWorksheet(document, layout, form.elements.tracing.value);
    preview.replaceChildren(...sheets);
    printSheet.replaceChildren(...sheets.map(sheet => sheet.cloneNode(true)));
    return { sheets, paper: layout.paper };
  }

  function paperDescription(paper, pageCount) {
    return `A4 ${paper.orientation}${pageCount > 1 ? ` · ${pageCount} pages` : ""}`;
  }

  function showPrintPreview(tab, sheets, paper) {
    const doc = tab.document;
    doc.documentElement.lang = "en-GB";
    doc.title = "Handwriting practice worksheet";
    const viewport = doc.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1";
    const style = doc.createElement("style");
    style.textContent = `
      body { margin: 0; background: #edf1ee; color: #1f2927; font: 1rem system-ui, sans-serif; }
      header { display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
        gap: .7rem 1rem; padding: .85rem 1rem; background: white; border-bottom: 1px solid #c3cec7; }
      button { font: inherit; font-weight: 600; background: #205b4a; color: white;
        border: 0; border-radius: .4rem; padding: .6rem .8rem; cursor: pointer; }
      button:focus-visible { outline: 2px solid #205b4a; outline-offset: 3px; }
      header p { margin: 0; font-size: .85rem; }
      .worksheet { display: block; width: min(calc(100% - 2rem), ${paper.width}mm);
        height: auto; margin: 1rem auto; background: white; box-shadow: 0 4px 16px #283b3020; }
      ${printStyles(paper)}
    `;
    doc.head.append(viewport, style);
    const header = doc.createElement("header");
    const printButton = doc.createElement("button");
    printButton.textContent = "Print / Save PDF";
    printButton.addEventListener("click", () => tab.print());
    const paperNote = doc.createElement("p");
    paperNote.textContent = `${paperDescription(paper, sheets.length)} · Select Save as PDF in the print dialog for a file.`;
    header.append(printButton, paperNote);
    const page = doc.createElement("main");
    page.className = "print-sheet";
    page.append(...sheets.map(sheet => doc.importNode(sheet, true)));
    doc.body.append(header, page);
  }

  form.addEventListener("input", () => {
    popupNote.hidden = true;
    update();
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const result = update();
    if (!result) return;
    const tab = window.open("about:blank", "_blank");
    popupNote.hidden = !!tab;
    if (!tab) return;
    tab.opener = null;
    showPrintPreview(tab, result.sheets, result.paper);
  });
  print.addEventListener("click", () => {
    if (update()) window.print();
  });
  update();
})();
