import { describe, expect, test } from "bun:test";
import { validateGoogleFontsUrl } from "../src/fetch";

describe("validateGoogleFontsUrl", () => {
  test("accepts valid Google Fonts URL", () => {
    const url =
      "https://fonts.googleapis.com/css2?family=Roboto&display=swap";
    expect(() => validateGoogleFontsUrl(url)).not.toThrow();
  });

  test("rejects invalid domain", () => {
    const url = "https://example.com/fonts.css";
    expect(() => validateGoogleFontsUrl(url)).toThrow("Invalid domain");
  });

  test("rejects invalid URL", () => {
    const url = "not-a-url";
    expect(() => validateGoogleFontsUrl(url)).toThrow("Invalid URL");
  });
});
