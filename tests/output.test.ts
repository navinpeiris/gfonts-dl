import { describe, expect, test } from "bun:test";
import { rewriteCss, type FontDownload } from "../src/output";
import type { FontFace } from "../src/parse";

describe("rewriteCss", () => {
  const fontFace: FontFace = {
    comment: "latin",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "400",
    fontUrl: "https://fonts.gstatic.com/s/roboto/v30/abc.woff2",
    fullBlock: `@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/roboto/v30/abc.woff2) format('woff2');
  unicode-range: U+0000-00FF;
}`,
  };

  test("rewrites src URL with /fonts/ prefix", () => {
    const downloads: FontDownload[] = [
      {
        fontFace,
        filename: "roboto-latin-400-v30.woff2",
        data: new ArrayBuffer(0),
      },
    ];

    const css = rewriteCss(downloads);
    expect(css).toContain("url(/fonts/roboto-latin-400-v30.woff2)");
  });

  test("includes comment in output", () => {
    const downloads: FontDownload[] = [
      {
        fontFace,
        filename: "roboto-latin-400-v30.woff2",
        data: new ArrayBuffer(0),
      },
    ];

    const css = rewriteCss(downloads);
    expect(css).toContain("/* latin */");
  });

  test("preserves unicode-range", () => {
    const downloads: FontDownload[] = [
      {
        fontFace,
        filename: "roboto-latin-400-v30.woff2",
        data: new ArrayBuffer(0),
      },
    ];

    const css = rewriteCss(downloads);
    expect(css).toContain("unicode-range: U+0000-00FF;");
  });

  test("supports custom URL prefix", () => {
    const downloads: FontDownload[] = [
      {
        fontFace,
        filename: "roboto-latin-400-v30.woff2",
        data: new ArrayBuffer(0),
      },
    ];

    const css = rewriteCss(downloads, "/assets/");
    expect(css).toContain("url(/assets/roboto-latin-400-v30.woff2)");
  });
});
