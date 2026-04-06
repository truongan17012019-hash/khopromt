// This script will be populated with file contents and run on Windows
const fs = require('fs');
const path = require('path');
const base = 'D:/Promt/promptvn/src';

function w(p, c) {
  const f = path.join(base, p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c, 'utf8');
  console.log('OK:', p);
}

console.log('Starting file creation...');
