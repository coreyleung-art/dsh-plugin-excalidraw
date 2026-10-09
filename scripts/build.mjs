#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lib = join(root, 'lib');
function run(cmd) { console.log('>', cmd); execSync(cmd, { cwd: root, stdio: 'inherit' }); }

run('npx tsc -p tsconfig.json');
run('npx esbuild src/client/index.tsx --bundle --format=cjs --platform=browser --target=es2022 --outfile=lib/.client.tmp.js --log-level=warning --external:react --external:react/jsx-runtime --external:react-dom --external:@deepseek-ai/*');

const bundle = readFileSync(join(lib, '.client.tmp.js'), 'utf8');
const wrapped = `window.__ModuleLoader__.load({
  id: "dsh-plugin-excalidraw",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
${bundle}
    return module.exports;
  }
});
`;
writeFileSync(join(lib, 'client.js'), wrapped);
console.log('> wrote lib/client.js', wrapped.length, 'bytes');
try { execSync('rm -f lib/.client.tmp.js', { cwd: root }); } catch {}
mkdirSync(join(lib, 'types', 'client'), { recursive: true });
writeFileSync(join(lib, 'types', 'client', 'index.d.ts'), 'export interface ExcalidrawState { open?: boolean }\n');
console.log('build ok');
