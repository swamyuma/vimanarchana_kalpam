// Extract VIMANARCHANA_CHAPTERS array from the reader HTML.
const fs = require('fs');
const READER = process.env.READER || 'C:/Users/umasu/Documents/gate-files/vimanarchana_reader/Vimanarcanakalpa-Reader-reconciled.html';
function load() {
  const html = fs.readFileSync(READER, 'utf8');
  const marker = 'const VIMANARCHANA_CHAPTERS = ';
  const i = html.indexOf(marker);
  if (i < 0) throw new Error('marker not found');
  const start = i + marker.length;
  // find the matching closing bracket for the array literal
  let depth = 0, j = start, inStr = false, strCh = '', esc = false;
  for (; j < html.length; j++) {
    const c = html[j];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === strCh) { inStr = false; }
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { j++; break; } }
  }
  const arrText = html.slice(start, j);
  const chapters = JSON.parse(arrText);
  return { html, chapters, start, end: j, arrText };
}
function serialize(chapters) {
  return JSON.stringify(chapters, null, 2);
}
function writeBack(html, start, end, chapters) {
  const arrText = serialize(chapters);
  return html.slice(0, start) + arrText + html.slice(end);
}
module.exports = { load, serialize, writeBack, READER };
