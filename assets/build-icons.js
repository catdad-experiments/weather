const path = require('path');
const { promises: fs } = require('fs');
const { generateIcons } = require('svg-app-icon');

const input = (...parts) => path.resolve(__dirname, ...parts);
const output = (...parts) => path.resolve(__dirname, '../icons', ...parts);

(async () => {
  await fs.rm(output(), { force: true, recursive: true });
  await fs.mkdir(output());

  const svg = await fs.readFile(input('icon.svg'));
  const mask = await fs.readFile(input('icon-mask.svg'));

  for await (const icon of generateIcons([mask, svg], {
    ico: false,
    icns: false,
    svg: true,
    png: true,
    pngSizes: [48, 192, 512]
  })) {
    await fs.writeFile(output(icon.name), icon.buffer);
  }
})();
