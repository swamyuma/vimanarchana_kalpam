const fs = require('fs');
const content = fs.readFileSync('vimanarchana_kalpa_chapter_70.md', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('page')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
