import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacements = {
  'rgba(43,43,43,1)': 'rgba(0,0,0,1)',
  'rgba(231,111,81,1)': 'rgba(163,0,55,1)', // #a30037
  '%23f4f1ea': '%23fff9ef'
};

for (const [oldColor, newColor] of Object.entries(replacements)) {
  content = content.split(oldColor).join(newColor);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Colors replaced in src/App.tsx');
