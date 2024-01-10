const path = require('path');
const { promises: fs } = require('fs');
const { generateIcons } = require('svg-app-icon');

const input = (...parts) => path.resolve(__dirname, ...parts);
const output = (...parts) => path.resolve(__dirname, '../icons', ...parts);

const background = '#cac9c8';

(async () => {
  await fs.rm(output(), { force: true, recursive: true });
  await fs.mkdir(output());

  const svg = await fs.readFile(input('icon.svg'));

  for await (const icon of generateIcons([`<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="${background}"/></svg>`, svg], {
    ico: false,
    icns: false,
    svg: true,
    png: true,
    pngSizes: [48, 192, 512]
  })) {
    await fs.writeFile(output(icon.name), icon.buffer);
  }

  for await (const icon of generateIcons([`<svg viewBox="0 0 10 10"><rect x="0" y="0" width="10" height="10" fill="${background}" /></svg>`, svg], {
    ico: false,
    icns: false,
    svg: false,
    png: true,
    pngSizes: [48, 192, 512]
  })) {
    const name = `${path.parse(icon.name).name}-maskable.${icon.ext}`;
    await fs.writeFile(output(name), icon.buffer);
  }

  for await (const icon of generateIcons([svg], {
    ico: false,
    icns: false,
    svg: false,
    png: true,
    pngSizes: [48, 192]
  })) {
    const name = `${path.parse(icon.name).name}-monochrome.${icon.ext}`;
    await fs.writeFile(output(name), icon.buffer);
  }
})();
