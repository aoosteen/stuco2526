import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldBase64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0wLDEwIFExMCwwIDIwLDEwIFQ0MCwxMCBUNjAsMTAgVDgwLDEwIFQxMDAsMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y0ZjFlYSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==';
const newSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">\n<path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" fill="none" stroke="#fff9ef" stroke-width="2"/>\n</svg>';
const newBase64 = Buffer.from(newSvg).toString('base64');

content = content.replace(oldBase64, newBase64);

fs.writeFileSync('src/App.tsx', content);
console.log('Base64 replaced in src/App.tsx');
