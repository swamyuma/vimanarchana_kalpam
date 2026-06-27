const fs = require('fs');
const path = require('path');

const pagesDir = "pages";

for (let pageNum = 305; pageNum <= 315; pageNum++) {
    const txtPath = path.join(pagesDir, `page_${pageNum}_text.txt`);
    if (!fs.existsSync(txtPath)) continue;
    
    const content = fs.readFileSync(txtPath, 'utf8');
    
    console.log(`=== Page ${pageNum} ===`);
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('पटल') || line.includes('७०') || line.includes('७१') || line.includes('७२') || line.includes('सप्तत') || line.includes('निष्कृ') || line.includes('प्राय')) {
            console.log(`  [Line ${idx+1}]: ${line.trim()}`);
        }
    });
}
