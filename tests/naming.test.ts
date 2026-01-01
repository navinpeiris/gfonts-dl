import { describe, expect, test } from "bun:test";
import { toKebabCase, isSingleWeight, generateFilename } from "../src/naming";
import type { FontFace } from "../src/parse";

describe("toKebabCase", () => {
  test("converts spaces to hyphens", () => {
    expect(toKebabCase("Google Sans Code")).toBe("google-sans-code");
  });

  test("handles multiple spaces", () => {
    expect(toKebabCase("Open  Sans")).toBe("open-sans");
  });

  test("removes leading/trailing hyphens", () => {
    expect(toKebabCase("  Font Name  ")).toBe("font-name");
  });
});

describe("isSingleWeight", () => {
  test("returns true for single values", () => {
    expect(isSingleWeight("400")).toBe(true);
    expect(isSingleWeight("700")).toBe(true);
  });

  test("returns false for ranges", () => {
    expect(isSingleWeight("1 1000")).toBe(false);
    expect(isSingleWeight("100 900")).toBe(false);
  });
});

describe("generateFilename", () => {
  const baseFontFace: FontFace = {
    comment: "latin",
    fontFamily: "Google Sans Code",
    fontStyle: "normal",
    fontWeight: "1 1000",
    fontUrl: "https://fonts.gstatic.com/s/googlesanscode/v16/abc.woff2",
    fullBlock: "",
  };

  test("generates basic filename", () => {
    const filename = generateFilename(baseFontFace, 0);
    expect(filename).toBe("google-sans-code-latin-v16.woff2");
  });

  test("includes italic in filename", () => {
    const fontFace = { ...baseFontFace, fontStyle: "italic" };
    const filename = generateFilename(fontFace, 0);
    expect(filename).toBe("google-sans-code-italic-latin-v16.woff2");
  });

  test("includes single weight in filename", () => {
    const fontFace = { ...baseFontFace, fontWeight: "400" };
    const filename = generateFilename(fontFace, 0);
    expect(filename).toBe("google-sans-code-latin-400-v16.woff2");
  });

  test("omits weight range from filename", () => {
    const fontFace = { ...baseFontFace, fontWeight: "100 900" };
    const filename = generateFilename(fontFace, 0);
    expect(filename).toBe("google-sans-code-latin-v16.woff2");
  });

  test("uses subset-N for invalid charset", () => {
    const fontFace = { ...baseFontFace, comment: "[0]" };
    const filename = generateFilename(fontFace, 5);
    expect(filename).toBe("google-sans-code-subset-5-v16.woff2");
  });

  test("includes italic and single weight", () => {
    const fontFace = {
      ...baseFontFace,
      fontStyle: "italic",
      fontWeight: "400",
    };
    const filename = generateFilename(fontFace, 0);
    expect(filename).toBe("google-sans-code-italic-latin-400-v16.woff2");
  });
});
