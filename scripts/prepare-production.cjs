const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '_site');
if (path.relative(root, output) !== '_site') throw new Error('Invalid production output directory');
if (fs.existsSync(output)) fs.rmSync(output, { recursive: true });
fs.mkdirSync(output);
// Keep function source outside the static publish directory. Preserve page/asset paths.
const excluded = new Set(['_site', 'netlify', 'scripts', 'node_modules', 'netlify.toml']);
for (const entry of fs.readdirSync(root)) {
  if (entry.startsWith('.') || excluded.has(entry)) continue;
  fs.cpSync(path.join(root, entry), path.join(output, entry), { recursive: true });
}
console.log('Prepared production pages and assets without changing their content.');
