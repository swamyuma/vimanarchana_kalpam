// Extract the ACTUAL PB_MARKER + explodeBlocks from the reader HTML and eval them,
// so verification runs the exact runtime code (no drift between test and reader).
const fs = require('fs');
const { READER } = require('./load.js');
function getExploder() {
  const html = fs.readFileSync(READER, 'utf8');
  const mi = html.indexOf("const PB_MARKER = '<!--PB-->';");
  if (mi < 0) throw new Error('PB_MARKER not found in reader');
  const fi = html.indexOf('function explodeBlocks(blocks) {', mi);
  // find matching close brace of explodeBlocks
  let d = 0, j = html.indexOf('{', fi), started = false;
  for (; j < html.length; j++) {
    const c = html[j];
    if (c === '{') { d++; started = true; }
    else if (c === '}') { d--; if (started && d === 0) { j++; break; } }
  }
  const src = html.slice(mi, j);
  // eslint-disable-next-line no-eval
  return eval('(function(){' + src + '; return { PB_MARKER, explodeBlocks };})()');
}
module.exports = { getExploder };
