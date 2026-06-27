const pdfLib = require('node_modules/pdf-parse');
const PDFParse = pdfLib.PDFParse;

console.log('PDFParse properties:', Object.getOwnPropertyNames(PDFParse));
console.log('PDFParse prototype properties:', Object.getOwnPropertyNames(PDFParse.prototype));

// Let's create an instance and check its properties
const fs = require('fs');
const pdfPath = "Vimanarchana_Kalpa_Sanskrit_TTD_1998.pdf";
if (fs.existsSync(pdfPath)) {
    const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
    console.log('Parser instance keys:', Object.keys(parser));
    // Let's print properties of parser proto
    let proto = Object.getPrototypeOf(parser);
    while (proto) {
        console.log('Proto properties:', Object.getOwnPropertyNames(proto));
        proto = Object.getPrototypeOf(proto);
    }
}
