const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\uma\\.gemini\\antigravity-cli\\brain';

if (!fs.existsSync(brainDir)) {
    console.log('Brain directory does not exist:', brainDir);
    process.exit(1);
}

const items = fs.readdirSync(brainDir);
console.log('Found folders in brain directory:', items);

// Let's inspect each folder to find the latest modified files
const foldersWithStats = items.map(name => {
    const p = path.join(brainDir, name);
    try {
        const stat = fs.statSync(p);
        return { name, path: p, isDirectory: stat.isDirectory(), mtime: stat.mtime };
    } catch (e) {
        return { name, path: p, isDirectory: false, mtime: new Date(0) };
    }
}).filter(f => f.isDirectory).sort((a, b) => b.mtime - a.mtime);

console.log('\nSorted by modification time (latest first):');
foldersWithStats.forEach(f => {
    console.log(`- ${f.name} (Modified: ${f.mtime.toISOString()})`);
});

// For the top 3 latest folders, let's read the last 3 user and assistant messages from their transcript.jsonl (or transcript_full.jsonl)
async function printRecentTranscript(folderName) {
    const transcriptPath = path.join(brainDir, folderName, '.system_generated', 'logs', 'transcript.jsonl');
    if (!fs.existsSync(transcriptPath)) {
        console.log(`\nNo transcript.jsonl found for ${folderName}`);
        return;
    }
    console.log(`\n========================================`);
    console.log(`Transcript for ${folderName}:`);
    console.log(`========================================`);
    
    const lines = [];
    const fileStream = fs.createReadStream(transcriptPath, 'utf8');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const obj = JSON.parse(line);
            lines.push(obj);
        } catch (e) {}
    }

    // Print the last 5 relevant steps
    const relevant = lines.filter(l => l.type === 'USER_INPUT' || l.type === 'PLANNER_RESPONSE');
    const lastFew = relevant.slice(-6);
    lastFew.forEach(item => {
        console.log(`--- [Type: ${item.type}] [Source: ${item.source}] ---`);
        let text = item.content || '';
        if (text.length > 800) {
            text = text.substring(0, 800) + '...\n[TRUNCATED]';
        }
        console.log(text);
        console.log('');
    });
}

(async () => {
    for (const f of foldersWithStats.slice(0, 3)) {
        await printRecentTranscript(f.name);
    }
})();
