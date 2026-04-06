// Master file generator for PromptVN new features
const fs = require('fs');
const path = require('path');
const base = 'D:/Promt/promptvn/src';

function w(relPath, content) {
  const full = path.join(base, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart(), 'utf8');
  console.log('OK:', relPath);
}

// Load all file contents from the parts directory
const parts = 'D:/Promt/promptvn/_parts';
fs.mkdirSync(parts, { recursive: true });
console.log('Generator ready. Run _gen2.js next.');
