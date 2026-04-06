const http = require('http');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    http.get(url, res => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', e => { fs.unlink(dest, () => {}); reject(e); });
  });
}

async function main() {
  const base = 'http://localhost:18765';
  console.log('Downloading gen_files_win.js...');
  await download(base + '/gen_files_win.js', '_gen1.js');
  console.log('Downloading gen_categories_win.js...');
  await download(base + '/gen_categories_win.js', '_gen2.js');
  console.log('Running gen_files...');
  require('./_gen1.js');
  console.log('Running gen_categories...');
  require('./_gen2.js');
  console.log('ALL DONE!');
}
main().catch(e => console.error('ERROR:', e.message));
