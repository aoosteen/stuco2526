import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacements = {
  '#f4f1ea': '#fff9ef',
  '#2b2b2b': '#000000',
  '#e76f51': '#a30037',
  '#2a9d8f': '#005986',
  '#e9c46a': '#FFC21A',
  '#264653': '#b8e6fe'
};

for (const [oldColor, newColor] of Object.entries(replacements)) {
  content = content.split(oldColor).join(newColor);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Colors replaced in src/App.tsx');
