# Changelog · dsh-plugin-excalidraw

## [迁移] - 2026-10-09

### CJS → ESM 迁移（代做）
- **时间戳**：2026-10-09T21:57
- **最后变动人**：session-b250bf9d
- **授权**：AUTH-20261009-dea67d017d9f（所有者原话：「4 个 cjs 插件做迁移，这次你代做。」）
- **通道**：plugin:dsh-plugin-excalidraw
- **变更**：tsconfig.json 的 `module` CommonJS→es2022；package.json 加 `"type": "module"`
- **验证**：tsc 重编译后 `lib/index.js` 为纯 ESM（`export` 语句、`exports.`/`require` 归零）；`node -e "import('./lib/index.js')"` 实测通过（`name`/`apply` 正常）；`lib/client.js` 未改动（仍为宿主 `__ModuleLoader__.load` 格式）。
- **回滚**：`git -C ~/dsh-plugin-excalidraw checkout <sha> -- .`，或 `cp -r /tmp/before-esm-dsh-plugin-excalidraw/* ~/dsh-plugin-excalidraw/`

## [0.1.0] - 2026-10-03
- **立件（R006 十项 + R039 存量补课）**：excalidraw 轻量白板嵌入（C4 选型落地）。
- 前身：2026-08-18 前后形成的 excalidraw 白板组件（懒加载白板，UI 层与 OpenPencil / ui-spec 隔离），
  长期缺 CHANGELOG、docs/README.md、lib/selfcheck.js、cli.js。
- **本批补齐内容清单**：
  - 新增 CHANGELOG.md（本文件）；
  - 新增 docs/README.md（R006 ⑤ 结构：为什么需要/用法/达标矩阵/坑/复现命令）；
  - 新增 lib/selfcheck.js（R006 ② TCC 检测 + 真挂载冒烟三态；本插件为 CJS 形态，selfcheck/cli 以 CJS 运行）；
  - 新增 cli.js（R006 ⑨ 极简治理入口：--tool-version / --selfcheck / 未知旗标 exit 2）。
- **验证**：`node lib/selfcheck.js`（冒烟 pass：apply 空实现正常返回 + 无 defineTool 工具）·
  `python3 ~/dsh-collab/scripts/doc-cn-check.py docs/README.md`（中文 >100 字）。
- **坑记录**：host 端 apply 为空实现（白板纯前端）；客户端经 `window.__ModuleLoader__.load` 注册 sidebar slot 并渲染白板。
