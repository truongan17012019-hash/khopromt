const fs = require('fs');
const path = require('path');
const base = 'D:/Promt/promptvn';
const dirs = [
  'src/app/blog', 'src/app/blog/[slug]',
  'src/app/khoa-hoc', 'src/app/khoa-hoc/[slug]',
  'src/app/nang-cap-prompt',
  'src/app/admin/blog', 'src/app/admin/courses',
  'src/app/api/blog', 'src/app/api/admin/blog',
  'src/app/api/courses', 'src/app/api/prompt-enhancer'
];
dirs.forEach(d => {
  fs.mkdirSync(path.join(base, d), { recursive: true });
  console.log('Created:', d);
});
console.log('DONE');
