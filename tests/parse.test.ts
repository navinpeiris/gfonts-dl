import { describe, expect, test } from "bun:test";
import { parseCss, extractVersion, isValidCharset } from "../src/parse";

const fixture = await Bun.file("tests/fixtures/google-sans-code.css").text();

describe("parseCss", () => {
  test("extracts all @font-face blocks", () => {
    const result = parseCss(fixture);
    expect(result).toHaveLength(4);
  });

  test("extracts font-family", () => {
    const result = parseCss(fixture);
    expect(result[0].fontFamily).toBe("Google Sans Code");
  });

  test("extracts comment", () => {
    const result = parseCss(fixture);
    expect(result[0].comment).toBe("canadian-aboriginal");
    expect(result[1].comment).toBe("cherokee");
  });

  test("extracts font-style", () => {
    const result = parseCss(fixture);
    expect(result[0].fontStyle).toBe("normal");
    expect(result[2].fontStyle).toBe("italic");
  });

  test("extracts font-weight", () => {
    const result = parseCss(fixture);
    expect(result[0].fontWeight).toBe("1 1000");
    expect(result[2].fontWeight).toBe("400");
  });

  test("extracts font URL", () => {
    const result = parseCss(fixture);
    expect(result[0].fontUrl).toBe(
      "https://fonts.gstatic.com/s/googlesanscode/v16/abc123-canadian.woff2"
    );
  });
});

describe("extractVersion", () => {
  test("extracts version from URL", () => {
    const url = "https://fonts.gstatic.com/s/googlesansflex/v16/abc.woff2";
    expect(extractVersion(url)).toBe("v16");
  });

  test("throws on missing version", () => {
    const url = "https://example.com/font.woff2";
    expect(() => extractVersion(url)).toThrow("Cannot extract version");
  });
});

describe("isValidCharset", () => {
  test("accepts valid charset names", () => {
    expect(isValidCharset("latin")).toBe(true);
    expect(isValidCharset("latin-ext")).toBe(true);
    expect(isValidCharset("canadian-aboriginal")).toBe(true);
  });

  test("rejects invalid charset names", () => {
    expect(isValidCharset("[0]")).toBe(false);
    expect(isValidCharset("0")).toBe(false);
    expect(isValidCharset("")).toBe(false);
  });
});
