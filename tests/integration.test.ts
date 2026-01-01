import { describe, expect, test } from "bun:test";
import { fetchCss } from "../src/fetch";
import { parseCss } from "../src/parse";

describe("integration", () => {
  test("fetches and parses real Google Fonts CSS", async () => {
    const url =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap";

    const css = await fetchCss(url);
    expect(css).toContain("@font-face");
    expect(css).toContain("font-family: 'Roboto'");

    const fontFaces = parseCss(css);
    expect(fontFaces.length).toBeGreaterThan(0);
    expect(fontFaces[0].fontFamily).toBe("Roboto");
    expect(fontFaces[0].fontUrl).toContain(".woff2");
  });
});
