const fs = require('fs');
const path = require('path');
let content = fs.readFileSync('lib/quizAudio.ts', 'utf8');
const lines = content.split('\n');
const filtered = lines.filter(line => {
  const match = line.match(/require\("([^"]+)"\)/);
  if (!match) return true;
  const filePath = match[1].replace('@/', '');
  return fs.existsSync(path.join(process.cwd(), filePath));
});
fs.writeFileSync('lib/quizAudio.ts', filtered.join('\n'));
console.log('Done. Removed', lines.length - filtered.length, 'missing entries.');
