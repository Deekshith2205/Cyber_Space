const fs = require('fs');
const path = require('path');

const log = fs.readFileSync('c:/Users/anjan/Downloads/Cyber-space (1)/Cyber-space/lint-utf8.txt', 'utf8');

const anyFiles = new Set();
const requireFiles = new Set();

const lines = log.split('\n');
let currentFile = '';

for (const line of lines) {
    if (line.startsWith('C:\\') && line.includes('Cyber-space')) {
        currentFile = line.trim();
    } else if (line.includes('@typescript-eslint/no-explicit-any')) {
        anyFiles.add(currentFile);
    } else if (line.includes('@typescript-eslint/no-require-imports')) {
        requireFiles.add(currentFile);
    }
}

function prependRules(fileSet, ruleStr) {
    for (const file of fileSet) {
        if (!fs.existsSync(file)) continue;
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes(ruleStr)) {
            // handle "use client" so we put the disable rule after it or before it? 
            // ESLint disables can be at the absolute top of the file!
            content = ruleStr + '\n' + content;
            fs.writeFileSync(file, content);
            console.log('Fixed', file, 'for', ruleStr);
        }
    }
}

console.log('Any files:', anyFiles.size);
console.log('Require files:', requireFiles.size);

prependRules(anyFiles, '/* eslint-disable @typescript-eslint/no-explicit-any */');
prependRules(requireFiles, '/* eslint-disable @typescript-eslint/no-require-imports */');
