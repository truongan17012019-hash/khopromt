const fs = require('fs');
const files = [
  'src/app/api/blog/route.ts',
  'src/app/api/admin/blog/route.ts',
  'src/app/blog/page.tsx',
  'src/app/blog/[slug]/page.tsx',
  'src/app/admin/blog/page.tsx',
  'src/lib/prompt-enhancement.ts',
  'src/app/api/prompt-enhancer/route.ts',
  'src/app/nang-cap-prompt/page.tsx',
  'src/data/courses.ts',
  'src/app/api/courses/route.ts',
  'src/app/khoa-hoc/page.tsx',
  'src/app/khoa-hoc/[slug]/page.tsx',
  'src/app/admin/courses/page.tsx',
  'src/data/prompts-realestate.ts',
  'src/data/prompts-healthcare.ts',
  'src/data/prompts-travel.ts',
  'src/data/prompts-legal.ts',
  'src/data/prompts-finance.ts',
  'src/data/prompts-hr.ts',
  'src/data/prompts-ecommerce.ts',
  'src/data/prompts-social.ts',
  'src/data/prompts-datascience.ts',
];
files.forEach(f => {
  try {
    const s = fs.statSync(f);
    console.log(s.size > 100 ? 'OK' : 'SMALL', f, s.size + 'B');
  } catch { console.log('MISSING', f); }
});
