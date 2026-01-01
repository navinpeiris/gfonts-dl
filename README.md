# gfonts-dl

Download Google Fonts font files and generate CSS file for self-hosting.

## Usage

```bash
./gfonts-dl "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
```

This will download the font files and generate a `fonts.css` file in the `./output` directory.

## Options

| Flag                 | Default | Description      |
| -------------------- | ------- | ---------------- |
| `-o, --output <dir>` | `./output` | Output directory |
| `-h, --help`         |         | Show help        |

## Output

Downloads all font files and generates a `fonts.css` with rewritten URLs:

```css
/* latin */
@font-face {
  font-family: "Roboto";
  src: url(/fonts/roboto-latin-400-v30.woff2) format("woff2");
  ...;
}
```

## Install

```bash
# Local
./gfonts-dl <url>

# Global
bun install -g gfonts-dl
```

## Development

```bash
bun install
bun test
```
