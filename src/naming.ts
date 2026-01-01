import { type FontFace, extractVersion, isValidCharset } from "./parse";

export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isSingleWeight(weight: string): boolean {
  // Single weight: just a number like "400" or "700"
  // Range: "1 1000" or "100 900"
  return /^\d+$/.test(weight.trim());
}

export function generateFilename(fontFace: FontFace, index: number): string {
  const parts: string[] = [];

  // Family name in kebab-case
  parts.push(toKebabCase(fontFace.fontFamily));

  // Style (only if italic)
  if (fontFace.fontStyle === "italic") {
    parts.push("italic");
  }

  // Charset from comment, or fallback to subset-N
  if (isValidCharset(fontFace.comment)) {
    parts.push(toKebabCase(fontFace.comment));
  } else {
    parts.push(`subset-${index}`);
  }

  // Weight (only if single value)
  if (isSingleWeight(fontFace.fontWeight)) {
    parts.push(fontFace.fontWeight);
  }

  // Version
  const version = extractVersion(fontFace.fontUrl);
  parts.push(version);

  return `${parts.join("-")}.woff2`;
}
