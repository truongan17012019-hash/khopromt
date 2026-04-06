const fs = require('fs');
const c = fs.readFileSync('D:/Promt/promptvn/src/app/admin/layout.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (i >= 7 && i <= 28) console.log((i+1) + ': ' + l);
});
