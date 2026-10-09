# dsh-plugin-excalidraw · Excalidraw 轻量白板嵌入

> 版本 0.1.0（版本单一来源：package.json）· 位置 `~/dsh-plugin-excalidraw/`
> 形态：客户端插件（host 端 apply 为空实现，白板纯前端）

## ① 为什么需要

- 在 DSH GUI 内嵌 Excalidraw 轻量白板（C4 选型落地），UI 层与 OpenPencil / ui-spec 隔离，懒加载白板组件避免拖慢启动。
- 从源码与注释可推断的能力：host 端 `apply` 为空（源码注释「host 无需服务端逻辑（白板纯前端，client 注册 sidebar slot）」），
  客户端 `lib/client.js` 经 `window.__ModuleLoader__.load` 注册 sidebar slot 并渲染白板。
- 存量工具，历史事故未记录（本插件 2026-08-18 前后形成，无事故台账；本批补课时如实标注）。

## ② 用法

插件随 CLD 挂载，无独立 CLI 操作（白板在 GUI 侧边栏 slot 内使用）。治理入口（本批新增）：

```bash
node cli.js --tool-version     # 读 package.json version
node cli.js --selfcheck        # 调 lib/selfcheck.js（冒烟三态）
node lib/selfcheck.js          # 直接跑自查门
```

## ③ R006 达标矩阵（本批后）

| # | 项 | 判定 | 说明 |
|---|---|---|---|
| ① | dsh 插件形态 | ✓ | package.json + cordis.patch.yml + lib/index.js（exports.name/inject/apply）+ client slot |
| ② | TCC 检测 | ✓ | lib/selfcheck.js（依赖/符号/type:module/冒烟三态） |
| ③ | CLD 自适应 | ✓ | 纯前端白板，平台无关 |
| ④ | dsh 版本自适应 | ✓ | host 端零运行时依赖；client 经 __ModuleLoader__ 注入 |
| ⑤ | 文档化 | ✓ | docs/README.md（本批新增） |
| ⑥ | 版本管理 | ✓ | package.json v0.1.0 + cli.js --tool-version |
| ⑦ | 统一日志 | 待补 | 纯前端，无 host 侧统一日志落盘 |
| ⑧ | 自动落链 | 待登记 | 黑板 data/registry 登记卡待补 |
| ⑨ | CLI 治理 | ✓ | cli.js（未知旗标 exit 2） |
| ⑩ | 约束前置 | N/A | 纯前端白板嵌入，无删除/外部命令/任意写风险原语 |

## ④ 坑（实测）

1. **CJS 形态**：package.json 无 type:module，lib/index.js 为 tsc 产物（`"use strict"` + `exports.*`），
   selfcheck/cli 因此以 CJS 写法运行，避免「ESM 语法被按 CJS 解析 → SyntaxError」。
2. **host 端 apply 空实现**：白板纯前端，host 无服务端逻辑；真挂载冒烟依赖 apply 正常返回（空函数），如实 pass。
3. **无 defineTool 工具**：注册集为空，冒烟工具断言退化为「空集注册」恒真，pass 判定以「apply 正常返回」为准。
4. **依赖 @excalidraw/excalidraw**：仅在 client 端使用，host 端 index.js 不 import（不阻塞 node lib/selfcheck.js 冒烟）。

## ⑤ 复现命令

```bash
node ~/dsh-plugin-excalidraw/lib/selfcheck.js
python3 ~/dsh-collab/scripts/doc-cn-check.py ~/dsh-plugin-excalidraw/docs/README.md
node ~/dsh-plugin-excalidraw/cli.js --tool-version
```
