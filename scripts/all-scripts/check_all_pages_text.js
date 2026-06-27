const fs = require('fs');

async function run() {
    try {
        const pdfPath = "Vimanarchana_Kalpa_Sanskrit_TTD_1998.pdf";
        if (!fs.existsSync(pdfPath)) {
            console.error("PDF file does not exist");
            return;
        }
        const pdfLib = require('node_modules/pdf-parse');
        const dataBuffer = fs.readFileSync(pdfPath);
        
        console.log("Loading and parsing PDF...");
        
        // We will hook into the page callback to get page-by-page text lengths
        let pageNum = 0;
        const pageLengths = [];
        
        await pdfLib(dataBuffer, {
            pagerender: function(pageData) {
                pageNum++;
                return pageData.getTextContent().then(function(textContent) {
                    let text = "";
                    for (let item of textContent.items) {
                        text += item.str + " ";
                    }
                    pageLengths.push({ page: pageNum, length: text.trim().length });
                    return text;
                });
            }
        });
        
        console.log(`Parsed ${pageLengths.length} pages.`);
        const nonTrivialPages = pageLengths.filter(p => p.length > 30);
        console.log(`Found ${nonTrivialPages.length} pages with text length > 30 characters.`);
        if (nonTrivialPages.length > 0) {
            console.log("Sample of non-trivial pages:");
            console.log(nonTrivialPages.slice(0, 10));
        } else {
            console.log("No pages have significant text layer. The PDF is 100% scanned images.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
