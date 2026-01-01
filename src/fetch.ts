// Chrome User-Agent to get woff2 format
const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export function validateGoogleFontsUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  if (parsed.hostname !== "fonts.googleapis.com") {
    throw new Error(
      `Invalid domain: ${parsed.hostname}. Only fonts.googleapis.com is supported.`
    );
  }
}

export async function fetchCss(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": CHROME_UA,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CSS: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

export async function fetchFont(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": CHROME_UA,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.status} ${response.statusText}`);
  }

  return response.arrayBuffer();
}
