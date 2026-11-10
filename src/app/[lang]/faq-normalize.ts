// Arabic-friendly matching for the FAQ search. Both the questions and the
// query are folded the same way: no tashkeel or tatweel, the alef forms as
// one, ة as ه, ى as ي, ؤ as و, ئ as ي, Arabic-Indic and Persian digits as 0-9,
// and Latin in lower case. `map` says
// which character of the original each folded character came from, so a match
// can be highlighted in the text as written.
const fold: Record<string, string> = { أ: "ا", إ: "ا", آ: "ا", ٱ: "ا", ة: "ه", ى: "ي", ؤ: "و", ئ: "ي" };

export function normalizeAr(text: string): { norm: string; map: number[] } {
  let norm = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/[ً-ٰٟـ]/.test(ch)) continue; // tashkeel, dagger alef, tatweel
    const code = ch.charCodeAt(0);
    const digit = code >= 0x660 && code <= 0x669 ? code - 0x660 : code >= 0x6f0 && code <= 0x6f9 ? code - 0x6f0 : -1;
    norm += digit >= 0 ? String(digit) : (fold[ch] ?? ch).toLowerCase();
    map.push(i);
  }
  return { norm, map };
}

export const fix = (text: string) => normalizeAr(text).norm;
