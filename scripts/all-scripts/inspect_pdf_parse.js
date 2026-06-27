const pdfParse = require('node_modules/pdf-parse');
console.log('Type of pdf-parse export:', typeof pdfParse);
console.log('Keys of pdf-parse export:', Object.keys(pdfParse));
if (typeof pdfParse === 'function') {
    console.log('pdfParse is a function');
} else if (pdfParse.default) {
    console.log('pdfParse.default is a function:', typeof pdfParse.default);
}
