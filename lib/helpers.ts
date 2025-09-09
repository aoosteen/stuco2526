export function scrambleWord(text:string) {
  return text.split(/\b/).map(part => {
    // \b splits words and keeps spaces/punctuation intact

    if (/^[a-zA-Z]+$/.test(part)) {

      const letters = part.split('');

      // Fisher-Yates shuffle
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }

      return letters.join('');
    }

    return part; 
  }).join('');
}


export function sanitizeForGroq(input:string) {
function sanitizeForLiteral(input:string) {
  if (!input) return "";
  const s = input.replace(/\s+/g," ").trim().replace(/[\[\]\{\}\(\)]/g, "");
  // make * literal
  return s.replace(/\*/g, "\\*");
}

const raw = input;
const sanitized = sanitizeForLiteral(raw);
const pattern = `*${sanitized}*`;
const safeLiteral = JSON.stringify(pattern);

return safeLiteral
}