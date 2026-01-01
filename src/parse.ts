export interface FontFace {
  comment: string;
  fontFamily: string;
  fontStyle: string;
  fontWeight: string;
  fontUrl: string;
  fullBlock: string;
}

const FONT_FACE_REGEX = /\/\*\s*([^*]+?)\s*\*\/\s*(@font-face\s*\{[^}]+\})/g;
const FONT_FAMILY_REGEX = /font-family:\s*['"]([^'"]+)['"]/;
const FONT_STYLE_REGEX = /font-style:\s*(\w+)/;
const FONT_WEIGHT_REGEX = /font-weight:\s*([^;]+)/;
const SRC_URL_REGEX = /src:\s*url\(([^)]+)\)/;

export function parseCss(css: string): FontFace[] {
  const results: FontFace[] = [];
  let match: RegExpExecArray | null;

  while ((match = FONT_FACE_REGEX.exec(css)) !== null) {
    const comment = match[1].trim();
    const block = match[2];

    const familyMatch = block.match(FONT_FAMILY_REGEX);
    const styleMatch = block.match(FONT_STYLE_REGEX);
    const weightMatch = block.match(FONT_WEIGHT_REGEX);
    const urlMatch = block.match(SRC_URL_REGEX);

    if (!familyMatch || !urlMatch) {
      continue;
    }

    results.push({
      comment,
      fontFamily: familyMatch[1],
      fontStyle: styleMatch?.[1] ?? "normal",
      fontWeight: weightMatch?.[1]?.trim() ?? "400",
      fontUrl: urlMatch[1],
      fullBlock: block,
    });
  }

  return results;
}

export function extractVersion(url: string): string {
  const match = url.match(/\/(v\d+)\//);
  if (!match) {
    throw new Error(`Cannot extract version from URL: ${url}`);
  }
  return match[1];
}

export function isValidCharset(comment: string): boolean {
  // Valid charset: letters, numbers, hyphens, no brackets or numbers only
  return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(comment);
}
