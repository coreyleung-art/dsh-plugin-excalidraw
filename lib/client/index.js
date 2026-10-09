// dsh-plugin-excalidraw — Client half v1
// excalidraw 白板嵌入（C4）：动态 import 懒加载 + portal 抽屉 + 错误边界
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@deepseek-ai/dsh-client-ui-primitives';
// 诊断徽标
function showBadge(text) {
    try {
        let el = document.getElementById('xd-error-badge');
        if (!el) {
            el = document.createElement('div');
            el.id = 'xd-error-badge';
            el.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:999999;max-width:70vw;background:#7f1d1d;color:#fff;padding:10px 14px;border-radius:10px;font:12px/1.6 ui-monospace,Menlo,monospace;white-space:pre-wrap;box-shadow:0 4px 16px rgba(0,0,0,.45);cursor:pointer';
            el.addEventListener('click', () => el?.remove());
            document.body.appendChild(el);
        }
        el.textContent = '[白板] ' + text;
    }
    catch { /* ignore */ }
}
if (typeof window !== 'undefined') {
    window.addEventListener('error', (e) => showBadge('error: ' + String(e.error?.message ?? e.message)));
    window.addEventListener('unhandledrejection', (e) => showBadge('rejection: ' + String(e.reason?.message ?? e.reason)));
}
const CSS_ID = 'dsh-plugin-excalidraw';
const css = `
#${CSS_ID}-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 620px; z-index: 999998; background: var(--dsw-surface, #1c1c1e); border-left: 1px solid var(--dsw-border, #333); box-shadow: -8px 0 32px rgba(0,0,0,.4); display: flex; flex-direction: column; font-family: -apple-system, 'PingFang SC', sans-serif; }
#${CSS_ID}-drawer .xd-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--dsw-border, #333); }
#${CSS_ID}-drawer .xd-head h3 { margin: 0; font-size: 14px; font-weight: 600; color: var(--dsw-text, #eee); }
#${CSS_ID}-drawer .xd-body { flex: 1; overflow: hidden; }
#${CSS_ID}-drawer .xd-loading { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--dsw-text-secondary, #999); font-size: 13px; }
`;
if (typeof document !== 'undefined' && !document.getElementById(CSS_ID)) {
    const el = document.createElement('style');
    el.id = CSS_ID;
    el.textContent = css;
    document.head.appendChild(el);
}
// 动态 import 懒加载 excalidraw（首屏不加载，打开时再拉）
const ExcalidrawLazy = lazy(() => import('@excalidraw/excalidraw').then((m) => {
    // 编译产物方式：只引主包组件，index.css 由 host 侧注入（避免 sass 链）
    return { default: m.Excalidraw };
}));
function Whiteboard({ onClose }) {
    return (React.createElement("div", { id: CSS_ID + '-drawer', onClick: (e) => e.stopPropagation() },
        React.createElement("div", { className: "xd-head" },
            React.createElement("h3", null, "\u270F\uFE0F \u767D\u677F\uFF08excalidraw\uFF09"),
            React.createElement(Button, { small: true, icon: "close", onClick: onClose }, "\u5173\u95ED")),
        React.createElement("div", { className: "xd-body" },
            React.createElement(Suspense, { fallback: React.createElement("div", { className: "xd-loading" }, "\u52A0\u8F7D\u767D\u677F\u4E2D\u2026") },
                React.createElement(ExcalidrawLazy, { initialData: { elements: [], appState: { viewBackgroundColor: '#1c1c1e' } }, UIOptions: { canvasActions: { export: false } } })))));
}
function WhiteboardEntry() {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener('excalidraw:open', onOpen);
        return () => window.removeEventListener('excalidraw:open', onOpen);
    }, []);
    return (React.createElement(React.Fragment, null, open && createPortal(React.createElement(Whiteboard, { onClose: () => setOpen(false) }), document.body)));
}
// ── cordis slot 注册（对齐 workflow-capture/flower-cockpit 模式）──
const inject = ['slots'];
function apply(ctx) {
    console.info('[excalidraw] client loaded');
    if (typeof document !== 'undefined' && !document.getElementById(CSS_ID)) {
        const el = document.createElement('style');
        el.id = CSS_ID;
        el.textContent = css;
        document.head.appendChild(el);
    }
    ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
        name: 'sidebar.footer.action',
        id: 'excalidraw',
        order: 9,
        label: () => '白板',
    }, WhiteboardEntry));
}
export { apply, inject };
