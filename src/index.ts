import { parseArgs } from "util";
import { validateGoogleFontsUrl, fetchCss, fetchFont } from "./fetch";
import { parseCss } from "./parse";
import { generateFilename } from "./naming";
import { rewriteCss, writeOutputFiles, type FontDownload } from "./output";

function printUsage(): void {
  console.log(`Usage: gfonts-dl <google-fonts-url> [options]

Options:
  -o, --output <dir>  Output directory (default: ./output)
  -h, --help          Show this help message

Example:
  gfonts-dl "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
`);
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      output: { type: "string", short: "o", default: "./output" },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    printUsage();
    process.exit(values.help ? 0 : 1);
  }

  const url = positionals[0];
  const outputDir = values.output!;

  try {
    // Validate URL
    validateGoogleFontsUrl(url);

    // Fetch CSS
    console.log("Fetching CSS...");
    const css = await fetchCss(url);

    // Parse font faces
    const fontFaces = parseCss(css);
    if (fontFaces.length === 0) {
      throw new Error("No @font-face rules found in CSS");
    }

    console.log(`Found ${fontFaces.length} font files`);

    // Download all fonts in parallel
    const downloads: FontDownload[] = [];
    let completed = 0;

    await Promise.all(
      fontFaces.map(async (fontFace, index) => {
        const filename = generateFilename(fontFace, index);
        const data = await fetchFont(fontFace.fontUrl);

        downloads.push({ fontFace, filename, data });

        completed++;
        process.stdout.write(`\rDownloading ${completed} of ${fontFaces.length}...`);
      })
    );

    console.log("\nGenerating CSS...");

    // Sort downloads by original order
    downloads.sort((a, b) => {
      return fontFaces.indexOf(a.fontFace) - fontFaces.indexOf(b.fontFace);
    });

    // Generate rewritten CSS
    const newCss = rewriteCss(downloads);

    // Write output files
    await writeOutputFiles(outputDir, downloads, newCss);

    console.log(`Done! Saved ${downloads.length} fonts and fonts.css to ${outputDir}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
