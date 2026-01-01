import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import type { FontFace } from "./parse";

export interface FontDownload {
  fontFace: FontFace;
  filename: string;
  data: ArrayBuffer;
}

export function rewriteCss(
  downloads: FontDownload[],
  urlPrefix: string = "/fonts/"
): string {
  const blocks: string[] = [];

  for (const { fontFace, filename } of downloads) {
    // Rebuild the @font-face block with rewritten src
    const newSrc = `src: url(${urlPrefix}${filename}) format('woff2');`;

    // Replace the src line in the original block
    let rewritten = fontFace.fullBlock.replace(
      /src:\s*url\([^)]+\)[^;]*;/,
      newSrc
    );

    // Add the comment back
    blocks.push(`/* ${fontFace.comment} */\n${rewritten}`);
  }

  return blocks.join("\n");
}

export async function writeOutputFiles(
  outputDir: string,
  downloads: FontDownload[],
  cssContent: string
): Promise<void> {
  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // Write all font files
  await Promise.all(
    downloads.map(async ({ filename, data }) => {
      const filePath = join(outputDir, filename);
      await writeFile(filePath, Buffer.from(data));
    })
  );

  // Write CSS file
  const cssPath = join(outputDir, "fonts.css");
  await writeFile(cssPath, cssContent);
}
