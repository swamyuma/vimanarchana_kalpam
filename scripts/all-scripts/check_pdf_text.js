const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = 'Vimanarchana_Kalpa_Sanskrit_TTD_1998.pdf';

console.log('Reading PDF:', pdfPath);

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    console.log('Number of pages:', data.numpages);
    console.log('Length of text:', data.text.length);
    if (data.text.trim().length > 0) {
        console.log('Snippet of extracted text:');
        console.log(data.text.substring(0, 1000));
    } else {
        console.log('No text extracted (scanned/image only).');
    }
}).catch(err => {
    console.error('Error parsing PDF:', err);
});
