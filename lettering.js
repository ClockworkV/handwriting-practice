const handwritingLettering = (() => {
  "use strict";

  // Monoline letterforms. The baseline is y=0 and the lowercase body is 10 units
  // high. Both the solid model and its trace are drawn from these same strokes.
  const print = {
    A: [13, "M1 0 6.5 -15 12 0 M3 -5 H10"],
    B: [13, "M2 0 V-15 H6 C13 -15 13 -8 6 -8 H2 M6 -8 C14 -8 14 0 6 0 H2"],
    C: [13, "M12 -12 C8 -18 1 -14 1 -7.5 S8 3 12 -3"],
    D: [14, "M2 0 V-15 H5 C16 -15 16 0 5 0 Z"],
    E: [12, "M11 -15 H2 V0 H11 M2 -8 H9"],
    F: [11, "M2 0 V-15 H10 M2 -8 H9"],
    G: [14, "M13 -12 C8 -18 1 -14 1 -7.5 S8 3 13 -2 V-7 H8"],
    H: [14, "M2 -15 V0 M12 -15 V0 M2 -8 H12"],
    I: [7, "M3.5 -15 V0"],
    J: [11, "M9 -15 V-5 C9 1 3 2 1 -2"],
    K: [13, "M2 -15 V0 M12 -15 2 -6 M6 -9.5 12 0"],
    L: [11, "M2 -15 V0 H10"],
    M: [16, "M2 0 V-15 L8 -6 14 -15 V0"],
    N: [14, "M2 0 V-15 L12 0 V-15"],
    O: [15, "M7.5 -15 C16 -15 16 0 7.5 0 S-1 -15 7.5 -15 Z"],
    P: [12, "M2 0 V-15 H6 C13 -15 13 -7 6 -7 H2"],
    Q: [15, "M7.5 -15 C16 -15 16 0 7.5 0 S-1 -15 7.5 -15 Z M9 -4 14 1"],
    R: [13, "M2 0 V-15 H6 C13 -15 13 -7 6 -7 H2 M6 -7 12 0"],
    S: [12, "M11 -12.5 C8 -17 1 -15 1.5 -11 C2 -7 10.5 -8 11 -4 C12 1 4 2 1 -2"],
    T: [13, "M1 -15 H12 M6.5 -15 V0"],
    U: [14, "M2 -15 V-5 C2 2 12 2 12 -5 V-15"],
    V: [13, "M1 -15 6.5 0 12 -15"],
    W: [19, "M1 -15 5 0 9.5 -13 14 0 18 -15"],
    X: [13, "M1 -15 12 0 M12 -15 1 0"],
    Y: [13, "M1 -15 6.5 -7 12 -15 M6.5 -7 V0"],
    Z: [13, "M1 -15 H12 L1 0 H12"],
    a: [11, "M9 -7.5 C6 -12 1 -10 1 -5 S6 2 9 -2.5 M9 -10 V0"],
    b: [11, "M2 -15 V0 M2 -7.5 C5 -12 10 -10 10 -5 S5 2 2 -2.5"],
    c: [10, "M9 -8 C6 -12 1 -10 1 -5 S6 2 9 -2"],
    d: [11, "M9 -7.5 C6 -12 1 -10 1 -5 S6 2 9 -2.5 M9 -15 V0"],
    e: [10, "M1.5 -5.5 H9 C9 -12 1 -11 1 -5 C1 0 6 2 9 -2"],
    f: [8, "M7 -14 C4 -17 2.5 -14 2.5 -11 V0 M0.7 -10 H7"],
    g: [11, "M9 -7.5 C6 -12 1 -10 1 -5 S6 2 9 -2.5 M9 -10 V1 C9 6 4 7 1.5 4"],
    h: [11, "M2 -15 V0 M2 -7 C4 -11 9 -11 9 -7 V0"],
    i: [5, "M2.5 -10 V0", "M2.5 -13 h.05"],
    j: [5, "M3 -10 V2 C3 5 1.5 6 0 5", "M3 -13 h.05"],
    k: [10, "M2 -15 V0 M9 -10 2 -4 M5 -6.5 9 0"],
    l: [5, "M2.5 -15 V0"],
    m: [16, "M2 -10 V0 M2 -7 C4 -11 8 -11 8 -7 V0 M8 -7 C10 -11 14 -11 14 -7 V0"],
    n: [11, "M2 -10 V0 M2 -7 C4 -11 9 -11 9 -7 V0"],
    o: [11, "M5.5 -10 C11.5 -10 11.5 0 5.5 0 S-.5 -10 5.5 -10 Z"],
    p: [11, "M2 -10 V5 M2 -7.5 C5 -12 10 -10 10 -5 S5 2 2 -2.5"],
    q: [11, "M9 -7.5 C6 -12 1 -10 1 -5 S6 2 9 -2.5 M9 -10 V5"],
    r: [8, "M2 -10 V0 M2 -7 C4 -11 6 -11 7 -9"],
    s: [9, "M8 -8.5 C6 -11 1 -11 1.5 -8 C2 -5 7.5 -6 8 -3 C8.5 1 3 1 1 -1.5"],
    t: [8, "M3 -14 V-3 C3 0 5 1 7 -1 M.5 -10 H7"],
    u: [11, "M2 -10 V-3 C2 1 7 1 9 -3 M9 -10 V0"],
    v: [11, "M1 -10 5.5 0 10 -10"],
    w: [16, "M1 -10 4.5 0 8 -8 11.5 0 15 -10"],
    x: [10, "M1 -10 9 0 M9 -10 1 0"],
    y: [11, "M1 -10 5.5 0 M10 -10 3.5 5"],
    z: [10, "M1 -10 H9 L1 0 H9"],
    0: [12, "M6 -15 C12.5 -15 12.5 0 6 0 S-.5 -15 6 -15 Z"],
    1: [8, "M1 -11 5 -15 V0"],
    2: [11, "M1 -12 C3 -17 11 -16 10 -10 C9 -7 5 -4 1 0 H10"],
    3: [11, "M1 -13 C5 -17 11 -15 9.5 -11 C9 -9 7 -8 5 -8 C12 -8 12 0 6 0 Q3 0 1 -2"],
    4: [12, "M8 -15 1 -5 H11 M8 -15 V0"],
    5: [11, "M10 -15 H2 L1.5 -8 C5 -11 10 -9 10 -5 C10 0 5 2 1 -2"],
    6: [11, "M9.5 -13 C4 -19 1 -10 1 -5 C1 2 10 2 10 -4 C10 -10 3 -10 1 -5"],
    7: [11, "M1 -15 H10 L4 0"],
    8: [11, "M5.5 -8 C0 -10 0 -15 5.5 -15 S11 -10 5.5 -8 C-1 -6 0 0 5.5 0 S12 -6 5.5 -8 Z"],
    9: [11, "M1.5 -2 C7 4 10 -5 10 -10 C10 -17 1 -17 1 -11 C1 -5 8 -5 10 -10"],
    ".": [5, "M2.5 0 h.05"],
    ",": [5, "M3 -1 Q3 1 1.5 3"],
    "!": [5, "M2.5 -15 V-4 M2.5 0 h.05"],
    "?": [11, "M1 -12 Q2 -15 6 -15 C12 -15 11 -9 8 -8 Q5.5 -7 5.5 -4 M5.5 0 h.05"],
    ":": [5, "M2.5 -8 h.05 M2.5 0 h.05"],
    ";": [5, "M2.5 -8 h.05 M3 -1 Q3 1 1.5 3"],
    "'": [5, "M3 -15 Q3 -13 1.8 -12"],
    "‘": [5, "M2 -12 Q2 -14 3.2 -15"],
    '"': [8, "M3 -15 Q3 -13 1.8 -12 M6.5 -15 Q6.5 -13 5.3 -12"],
    "“": [8, "M2 -12 Q2 -14 3.2 -15 M5.5 -12 Q5.5 -14 6.7 -15"],
    "-": [8, "M1.5 -5 H6.5"],
    "–": [11, "M1 -5 H10"],
    "—": [15, "M1 -5 H14"],
    "…": [11, "M2 0 h.05 M5.5 0 h.05 M9 0 h.05"],
    "(": [6, "M5 -15 C0 -11 0 -2 5 2"],
    ")": [6, "M1 -15 C6 -11 6 -2 1 2"],
    "[": [6, "M5 -15 H2 V2 H5"],
    "]": [6, "M1 -15 H4 V2 H1"],
    "/": [10, "M1 1 9 -15"],
    "&": [14, "M13 0 4 -10 C0 -16 11 -17 9 -11 C8 -8 1 -8 1 -4 C1 3 11 1 12 -7"],
    "+": [12, "M2 -7 H10 M6 -11 V-3"],
    "=": [12, "M2 -9 H10 M2 -5 H10"],
    "%": [16, "M3 0 13 -15 M5 -15 C9 -15 9 -9 5 -9 S1 -15 5 -15 Z M11 -6 C15 -6 15 0 11 0 S7 -6 11 -6 Z"],
    "£": [12, "M10 -12 C10 -17 3 -16 3 -11 L4 -5 Q4 -2 1 0 H11 M1 -7 H8"],
    "€": [13, "M12 -13 C8 -18 3 -14 3 -7.5 S8 3 12 -2 M1 -9 H9 M1 -6 H8"],
    "$": [12, "M11 -12 C7 -17 1 -15 1.5 -11 C2 -7 10.5 -8 11 -4 C12 1 4 2 1 -2 M6 -17 V2"],
    "@": [18, "M12 -9 C7 -13 4 -4 8 -4 Q11 -4 12 -9 L11 -5 C11 -2 16 -2 16 -8 C16 -18 1 -17 1 -7 C1 1 9 3 14 0"],
    "#": [14, "M5 -14 3 -1 M11 -14 9 -1 M1 -10 H13 M1 -5 H13"],
    Æ: [17, "M1 0 8 -15 H16 M8 -15 V0 H16 M4 -5 H8 M8 -8 H14"],
    æ: [15, "M8 -7 C6 -12 1 -10 1.5 -8 M8 -5.5 C0 -8 -1 2 5 0 Q7 0 8 -2 M8 -5.5 H14 C14 -12 7 -11 7 -5 C7 0 11 2 14 -2"],
    Œ: [20, "M7 -15 C15 -15 15 0 7 0 S-1 -15 7 -15 Z M18 -15 H13 V0 H18 M13 -8 H17"],
    œ: [18, "M5.5 -10 C11.5 -10 11.5 0 5.5 0 S-.5 -10 5.5 -10 Z M10 -5.5 H17 C17 -12 9 -11 9 -5 C9 0 14 2 17 -2"],
    ß: [11, "M2 0 V-10 C2 -17 11 -17 10 -12 Q9 -9 6 -8 C14 -6 10 2 5 -1"],
    Ł: [11, "M3 -15 V0 H10 M.5 -6 6.5 -10"],
    ł: [6, "M3 -15 V0 M.5 -6 5.5 -10"],
    Ø: [15, "M7.5 -15 C16 -15 16 0 7.5 0 S-1 -15 7.5 -15 Z M2 0 13 -15"],
    ø: [11, "M5.5 -10 C11.5 -10 11.5 0 5.5 0 S-.5 -10 5.5 -10 Z M1 0 10 -10"],
    Đ: [14, "M2 0 V-15 H5 C16 -15 16 0 5 0 Z M0 -8 H7"],
    đ: [11, "M9 -7.5 C6 -12 1 -10 1 -5 S6 2 9 -2.5 M9 -15 V0 M6 -12 H11"],
    ı: [5, "M2.5 -10 V0"],
  };

  // Slanted print has finishing strokes on several letters but leaves a pen
  // lift between letters.
  const slanted = {
    a: [11, "M9 -7.5 C6 -12 1 -10 1 -5 S6 2 9 -2.5 M9 -10 V-2 Q9 .8 10.5 -.5"],
    d: [11, "M9 -7.5 C6 -12 1 -10 1 -5 S6 2 9 -2.5 M9 -15 V-2 Q9 .8 10.5 -.5"],
    i: [6, "M2 -10 V-2 Q2 1 5 0", "M2 -13 h.05"],
    l: [6, "M2 -15 V-2 Q2 1 5 0"],
    u: [11, "M2 -10 V-3 C2 1 7 1 9 -3 M9 -10 V-2 Q9 .8 10.5 -.5"],
    y: [11, "M2 -10 V-3 C2 1 7 1 9 -3 M9 -10 V1 C9 6 4 7 1.5 4"],
  };

  // Join coordinates identify the points where the connecting pen stroke meets
  // each letter. Capitals and punctuation retain their separate print strokes.
  const joined = {
    a: [11, "M2 -8 C4 -11 8 -10 9 -7.5 C9 -2 7 0 4 0 C0 0 0 -5 2 -8 M9 -10 L8 -2 Q8 .5 10 0", [2, -8], [10, 0]],
    b: [11, "M1 -4 Q7 -9 7 -14 C7 -18 3 -14 2 -9 Q0 -2 3 0 C7 2 10 -4 9 -8 Q8 -10 7 -8 Q7 -6 10 -6", [1, -4], [10, -6]],
    c: [10, "M2 -7 Q5 -12 9 -8 M2 -7 C-2 0 5 3 9 -2", [2, -7], [9, -2]],
    d: [11, "M2 -8 C4 -11 8 -10 9 -7.5 C9 -2 7 0 4 0 C0 0 0 -5 2 -8 M10 -15 L8 -2 Q8 .5 10 0", [2, -8], [10, 0]],
    e: [10, "M1 -4 C5 -5 9 -7 7 -9 C4 -13 0 -6 1 -3 C2 1 6 1 9 -2", [1, -4], [9, -2]],
    f: [9, "M1 -5 C5 -9 9 -16 6 -16 C3 -16 2 -6 1 2 C0 8 6 4 6 0 Q6 -3 3 -3 L8 -4", [1, -5], [8, -4]],
    g: [11, "M2 -8 C4 -11 8 -10 9 -7.5 C9 -2 7 0 4 0 C0 0 0 -5 2 -8 M9 -10 L8 1 C7 7 1 7 2 4 Q3 2 10 -1", [2, -8], [10, -1]],
    h: [11, "M1 -5 Q7 -11 7 -15 C6 -18 3 -15 2 -11 L1 0 C3 -11 10 -13 9 -6 L8 -2 Q8 .5 10 0", [1, -5], [10, 0]],
    i: [5, "M2 -9 L1.5 -2 Q1.5 .5 4 0", [2, -9], [4, 0], "M2.5 -13 h.05"],
    j: [6, "M3 -9 L2 1 C1 7 -3 6 -2 3 Q-1 1 5 -1", [3, -9], [5, -1], "M3.5 -13 h.05"],
    k: [10, "M1 -5 Q7 -11 7 -15 C6 -18 3 -15 2 -11 L1 0 M1.5 -4 Q8 -13 9 -8 Q9 -6 4 -4 Q6 -4 7 -1 Q8 1 9 0", [1, -5], [9, 0]],
    l: [6, "M1 -5 Q7 -11 7 -15 C6 -18 3 -15 2 -11 Q-1 1 5 0", [1, -5], [5, 0]],
    m: [16, "M2 -9 1 0 C3 -12 10 -13 8 -5 L7 0 C9 -12 16 -13 14 -5 L13.5 -2 Q13 1 15 0", [2, -9], [15, 0]],
    n: [11, "M2 -9 1 0 C3 -12 10 -13 9 -5 L8 -2 Q8 .5 10 0", [2, -9], [10, 0]],
    o: [11, "M2 -8 C5 -12 10 -10 10 -5 C10 1 1 2 1 -4 Q1 -9 5 -10 Q6 -5 10 -6", [2, -8], [10, -6]],
    p: [11, "M2 -9 L1 5 M2 -6 C4 -11 10 -12 10 -7 C10 -2 6 1 3 -1 Q6 1 10 -1", [2, -9], [10, -1]],
    q: [11, "M2 -8 C4 -11 8 -10 9 -7.5 C9 -2 7 0 4 0 C0 0 0 -5 2 -8 M9 -10 L8 4 Q8 7 10 3 L10 -1", [2, -8], [10, -1]],
    r: [8, "M2 -9 1 0 C3 -10 5 -11 6 -9 Q6 -7 7 -7", [2, -9], [7, -7]],
    s: [9, "M1 -3 Q4 -7 5 -10 C4 -6 9 -5 8 -2 C7 1 3 1 2 -1 Q5 2 8 -1", [1, -3], [8, -1]],
    t: [8, "M2 -8 4 -14 2 -4 C1 0 4 1 7 -1 M.5 -10 H7", [2, -8], [7, -1]],
    u: [11, "M2 -9 1 -3 C0 2 7 1 9 -9 L8 -2 Q8 .5 10 0", [2, -9], [10, 0]],
    v: [11, "M1 -9 Q3 -8 3 -5 L4 0 Q7 -2 9 -9 Q8 -6 10 -6", [1, -9], [10, -6]],
    w: [16, "M1 -9 Q3 -8 3 -5 L4 0 Q7 -2 8 -8 L10 0 Q13 -2 14 -9 Q13 -6 15 -6", [1, -9], [15, -6]],
    x: [10, "M1 -8 Q3 -11 5 -6 L7 -1 Q8 1 9 0 M9 -10 1 0", [1, -8], [9, 0]],
    y: [11, "M2 -9 1 -3 C0 2 7 1 9 -9 L8 1 C7 7 1 7 2 4 Q3 2 10 -1", [2, -9], [10, -1]],
    z: [10, "M1 -8 Q3 -11 9 -10 L1 0 H9", [1, -8], [9, 0]],
  };

  const above = {
    "\u0300": "M-2 -2 1 0",
    "\u0301": "M-1 0 2 -2",
    "\u0302": "M-2 0 0 -2 2 0",
    "\u0303": "M-2 0 Q-1 -2 0 -1 T2 -2",
    "\u0304": "M-2 -1 H2",
    "\u0306": "M-2 -2 Q0 1 2 -2",
    "\u0307": "M0 -1 h.05",
    "\u0308": "M-1.7 -1 h.05 M1.7 -1 h.05",
    "\u030A": "M0 -2.8 a1.3 1.3 0 1 0 .01 0 Z",
    "\u030B": "M-2 0 0 -2 M1 0 3 -2",
    "\u030C": "M-2 -2 0 0 2 -2",
  };

  const below = {
    "\u0327": "M0 0 -1 2 C3 1 2 5 -1 4",
    "\u0328": "M1 0 C-2 1 -2 5 1 4",
    "\u0323": "M0 3 h.05",
  };

  const aliases = { "’": "'", "”": '"', "−": "-", "‑": "-", "‐": "-" };
  const slants = { print: 0, slanted: 0.16, joined: 0.15 };

  function glyph(character, style) {
    const [base, ...marks] = (aliases[character] ?? character).normalize("NFD");
    if (!Object.hasOwn(print, base) || marks.some(mark => !above[mark] && !below[mark])) return null;
    const cursive = style === "joined" && joined[base];
    const printLetter = style === "slanted" ? slanted[base] ?? print[base] : print[base];
    const [width, path, dot] = printLetter;
    const [advance, stroke, entry, exit, joinedDot] = cursive || [width, path];
    const accents = [];
    let accentHeight = /[A-ZbdfhkltÆŒŁØĐ]/u.test(base) ? -17 : -12;
    for (const mark of marks) {
      if (above[mark]) {
        accents.push({ path: above[mark], x: advance / 2, y: accentHeight });
        accentHeight -= 3.5;
      } else {
        accents.push({ path: below[mark], x: advance / 2, y: 0 });
      }
    }
    const point = cursive ? joinedDot : dot;
    return {
      advance: advance + (style === "joined" && !cursive ? 0.8 : 0),
      path: stroke + (point && !marks.some(mark => above[mark]) ? ` ${point}` : ""),
      entry, exit, accents,
    };
  }

  function shapeText(text, style) {
    const rows = [];
    for (const paragraph of text.normalize("NFC").trim().split(/\r?\n/u)) {
      const row = [];
      for (const character of paragraph.trim().replace(/[^\S\n]+/gu, " ")) {
        const letter = character === " " ? { advance: 5.8 } : glyph(character, style);
        if (!letter) return { unsupported: character };
        row.push(letter);
      }
      rows.push(row);
    }
    return { rows };
  }

  function wrapRows(rows, width) {
    const wrapped = [];
    for (const row of rows) {
      let line = [];
      let used = 0;
      let space = -1;
      for (const letter of row) {
        if (!letter.path) {
          if (!line.length) continue;
          if (used + letter.advance > width) {
            wrapped.push(line);
            line = [];
            used = 0;
            space = -1;
            continue;
          }
          space = line.length;
        }
        if (used + letter.advance > width) {
          const split = space < 0 ? line.length : space;
          wrapped.push(line.slice(0, split));
          line = line.slice(space < 0 ? split : split + 1);
          used = line.reduce((sum, next) => sum + next.advance, 0);
          space = -1;
          if (used + letter.advance > width) {
            wrapped.push(line);
            line = [];
            used = 0;
          }
        }
        line.push(letter);
        used += letter.advance;
      }
      wrapped.push(line.at(-1)?.path ? line : line.slice(0, -1));
    }
    return wrapped;
  }

  // Joins meet the relevant strokes and never run across spaces or punctuation.
  function lineStrokes(line, style) {
    const shapes = [];
    let x = 0;
    let previousExit;
    const shear = slants[style];
    for (const letter of line) {
      if (letter.path) {
        if (previousExit && letter.entry) {
          const [fromX, fromY] = previousExit;
          const [entryX, toY] = letter.entry;
          const toX = x + entryX - shear * toY;
          const mid = (fromX + toX) / 2;
          shapes.push({ path: `M${fromX} ${fromY} C${mid} ${fromY} ${mid} ${toY + 1} ${toX} ${toY}` });
        }
        shapes.push({ path: letter.path, transform: `matrix(1 0 ${-shear} 1 ${x} 0)` });
        for (const accent of letter.accents) {
          shapes.push({ path: accent.path, transform: `matrix(1 0 ${-shear} 1 ${x + accent.x - shear * accent.y} ${accent.y})` });
        }
      }
      previousExit = letter.exit && [x + letter.exit[0] - shear * letter.exit[1], letter.exit[1]];
      x += letter.advance;
    }
    return shapes;
  }

  return { lineStrokes, shapeText, wrapRows };
})();
