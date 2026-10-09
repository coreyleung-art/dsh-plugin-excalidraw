#!/usr/bin/env node
// cli.js — dsh-plugin-excalidraw 极简治理入口（R006 ⑨）
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'));

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) { console.error('用法: node cli.js [--tool-version | --selfcheck]'); return 2; }
  if (args[0] === '--tool-version') { console.log(pkg.version); return 0; }
  if (args[0] === '--selfcheck') {
    const { runSelfCheck } = require('./lib/selfcheck.js');
    return await runSelfCheck();
  }
  console.error('未知旗标: ' + args[0]);
  return 2;
}

main().then((c) => process.exit(c)).catch((e) => { console.error('异常: ' + (e.stack || e)); process.exit(1); });
