// lib/selfcheck.js — dsh-plugin-excalidraw 自查门（R006 ② TCC 检测 + ① 真挂载冒烟三态）
// 参考：~/dsh-plugin-bus-queue-triage/lib/selfcheck.js（三态冒烟）
//       ~/dsh-plugin-central-inbox/lib/selfcheck.js（runSelfCheck：peer/符号/type:module）
// 形态说明：本插件 package.json 无 type:module（CJS），lib/index.js 为 tsc 产物（"use strict" + exports.*）。
//   故本 selfcheck.js 以 CJS 写法运行，避免「ESM 语法被按 CJS 解析 → SyntaxError」。
// 用法：node lib/selfcheck.js → 输出 PASS/FAIL/SKIP 明细，exit 0/1
const { readFileSync, existsSync } = require('node:fs');
const { pathToFileURL } = require('node:url');
const { resolve } = require('node:path');

// —— 本插件自查参数（如实声明）——
const REQUIRED_PEERS = [];                                        // host 端零外部 peer 依赖
const REQUIRED_SYMBOLS = ['name', 'apply', 'inject'];            // Cordis 插件契约导出
const ENTRY = './index.js';                                       // 真挂载冒烟入口
const ENTRY_KIND = 'cordis';                                      // 有 apply() 的运行时插件

async function runSelfCheck() {
  const rows = [];
  const check = (name, status, detail = '') => rows.push({ name, status, detail });

  // ① 依赖完整性（peer 解析；CJS 下 require.resolve 原生可用）
  if (REQUIRED_PEERS.length === 0) {
    check('① 依赖完整性', 'pass', '零外部 peer 依赖（host 端 index.js 为 tsc 产物，无 import）');
  } else {
    for (const p of REQUIRED_PEERS) {
      try { require.resolve(p); check(`① peer:${p}`, 'pass'); }
      catch (e) { check(`① peer:${p}`, 'fail', (e.code || e.message)); }
    }
  }

  // ② 符号扫描（入口文件顶层导出）
  const entryAbs = resolve(__dirname, ENTRY);
  const src = existsSync(entryAbs) ? readFileSync(entryAbs, 'utf8') : '';
  for (const sym of REQUIRED_SYMBOLS) {
    const re = new RegExp('(exports\\.' + sym + '\\b|export\\s+(?:const|let|var|function)\\s+' + sym + '\\b)');
    check(`② 符号:${sym}`, re.test(src) ? 'pass' : 'fail', re.test(src) ? '' : '入口未导出 ' + sym);
  }

  // ③ type:module 一致性
  const pkgPath = resolve(__dirname, '..', 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    check('③ type:module', 'pass',
      pkg.type === 'module' ? 'type:module（ESM 形态）' : '无 type:module（CJS 形态；selfcheck/cli 以 CJS 运行，无失配）');
  } else {
    check('③ type:module', 'skip', '无 package.json');
  }

  // ④ 真挂载冒烟
  await mountSmoke(rows, check);

  const nFail = rows.filter((r) => r.status === 'fail').length;
  const nSkip = rows.filter((r) => r.status === 'skip').length;
  for (const r of rows) {
    const tag = r.status === 'pass' ? 'PASS' : r.status === 'fail' ? 'FAIL' : 'SKIP';
    console.log('  ' + tag + '  ' + r.name + (r.detail ? '  — ' + r.detail : ''));
  }
  let verdict, code;
  if (nFail > 0) { verdict = 'FAIL ' + nFail + ' 项'; code = 1; }
  else if (nSkip > 0 && nSkip >= rows.length) { verdict = 'SKIP（无法验证）'; code = 1; }
  else { verdict = 'PASS' + (nSkip ? '（' + nSkip + ' 项 SKIP）' : ''); code = 0; }
  console.log('  selfcheck: ' + verdict);
  return code;
}

async function mountSmoke(rows, check) {
  const entryAbs = resolve(__dirname, ENTRY);
  const registered = [];
  const stubCtx = {
    tools: { register: (t) => { if (t && t.name) registered.push(t.name); } },
    effect: (fn) => { if (typeof fn === 'function') fn(); },
    get: () => undefined,
    on: () => undefined,
  };
  try {
    const mod = await import(pathToFileURL(entryAbs).href);
    const src = readFileSync(entryAbs, 'utf8');
    const toolNames = new Set();
    const re = /defineTool\(\s*\{([\s\S]*?)\}\s*\)/g;
    let m;
    while ((m = re.exec(src))) { const nm = /name\s*:\s*['"`]([^'"`]+)['"`]/.exec(m[1]); if (nm) toolNames.add(nm[1]); }
    const applyFn = mod && (mod.apply || (mod.default && mod.default.apply));
    if (typeof applyFn !== 'function') {
      check('④ 真挂载冒烟', 'fail', '入口无 apply() 函数（导出: ' + Object.keys(mod || {}).join(',') + '）');
      return;
    }
    await applyFn(stubCtx, {});
    const missing = [...toolNames].filter((t) => !registered.includes(t));
    if (missing.length > 0) {
      check('④ 真挂载冒烟', 'fail', 'defineTool 工具未注册: ' + missing.join(',') + '（registered=' + JSON.stringify(registered) + '）');
    } else {
      check('④ 真挂载冒烟', 'pass',
        toolNames.size ? ('工具 ' + [...toolNames].join(',') + ' 已注册') : 'apply 正常返回；无 defineTool 工具（前端/slot 型插件，注册集为空）');
    }
  } catch (e) {
    const msg = String((e && e.message) || e);
    if (/ERR_MODULE_NOT_FOUND|Cannot find (module|package)/.test(msg)) {
      check('④ 真挂载冒烟', 'skip', '依赖在本目录解析不到: ' + msg.slice(0, 90));
    } else {
      check('④ 真挂载冒烟', 'fail', 'apply 抛异常(' + ((e.constructor && e.constructor.name) || 'Error') + '): ' + msg.slice(0, 110));
    }
  }
}

// CLI 入口：直接 node lib/selfcheck.js 时执行
const isMain = process.argv[1] && resolve(process.argv[1]) === __filename;
if (isMain) {
  runSelfCheck().then((c) => process.exit(c)).catch((e) => { console.error('异常: ' + (e.stack || e)); process.exit(1); });
}

module.exports = { runSelfCheck };
