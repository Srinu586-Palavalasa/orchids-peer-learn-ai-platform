const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Srinu Palavalasa\\Desktop\\orchids-peer-learn-ai-platform\\src\\app\\page.tsx', 'utf8');
const lines = content.split('\n');
const hookRegex = /\buse[A-Z]\w*/g;

lines.forEach((line, index) => {
    const matches = line.match(hookRegex);
    if (matches) {
        // Exclude imports and comments if possible, but basic is fine
        if (!line.trim().startsWith('import') && !line.trim().startsWith('//')) {
            console.log(`Line ${index + 1}: ${matches.join(', ')}`);
        }
    }
});
