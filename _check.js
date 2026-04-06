const c = require('fs').readFileSync('src/data/blog-posts.ts', 'utf8');
console.log('LINES:', c.split('\n').length);
const lines = c.split('\n');
for (let i = Math.max(0, lines.length - 10); i < lines.length; i++) {
  console.log(i + 1, lines[i]);
}
