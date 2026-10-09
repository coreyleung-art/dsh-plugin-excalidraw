window.__ModuleLoader__.load({
  id: "dsh-plugin-excalidraw",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = __toESM(require("react"));
var import_react_dom = require("react-dom");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
function showBadge(text) {
  try {
    let el = document.getElementById("xd-error-badge");
    if (!el) {
      el = document.createElement("div");
      el.id = "xd-error-badge";
      el.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:999999;max-width:70vw;background:#7f1d1d;color:#fff;padding:10px 14px;border-radius:10px;font:12px/1.6 ui-monospace,Menlo,monospace;white-space:pre-wrap;box-shadow:0 4px 16px rgba(0,0,0,.45);cursor:pointer";
      el.addEventListener("click", () => el?.remove());
      document.body.appendChild(el);
    }
    el.textContent = "[\u767D\u677F] " + text;
  } catch {
  }
}
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => showBadge("error: " + String(e.error?.message ?? e.message)));
  window.addEventListener("unhandledrejection", (e) => showBadge("rejection: " + String(e.reason?.message ?? e.reason)));
}
var CSS_ID = "dsh-plugin-excalidraw";
var css = `
#${CSS_ID}-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 620px; z-index: 999998; background: var(--dsw-surface, #1c1c1e); border-left: 1px solid var(--dsw-border, #333); box-shadow: -8px 0 32px rgba(0,0,0,.4); display: flex; flex-direction: column; font-family: -apple-system, 'PingFang SC', sans-serif; }
#${CSS_ID}-drawer .xd-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--dsw-border, #333); }
#${CSS_ID}-drawer .xd-head h3 { margin: 0; font-size: 14px; font-weight: 600; color: var(--dsw-text, #eee); }
#${CSS_ID}-drawer .xd-body { flex: 1; overflow: hidden; }
#${CSS_ID}-drawer .xd-loading { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--dsw-text-secondary, #999); font-size: 13px; }
`;
if (typeof document !== "undefined" && !document.getElementById(CSS_ID)) {
  const el = document.createElement("style");
  el.id = CSS_ID;
  el.textContent = css;
  document.head.appendChild(el);
}
var ExcalidrawLazy = (0, import_react.lazy)(
  () => import("@excalidraw/excalidraw").then((m) => {
    return { default: m.Excalidraw };
  })
);
function Whiteboard({ onClose }) {
  return /* @__PURE__ */ import_react.default.createElement("div", { id: CSS_ID + "-drawer", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ import_react.default.createElement("div", { className: "xd-head" }, /* @__PURE__ */ import_react.default.createElement("h3", null, "\u270F\uFE0F \u767D\u677F\uFF08excalidraw\uFF09"), /* @__PURE__ */ import_react.default.createElement(import_dsh_client_ui_primitives.Button, { small: true, icon: "close", onClick: onClose }, "\u5173\u95ED")), /* @__PURE__ */ import_react.default.createElement("div", { className: "xd-body" }, /* @__PURE__ */ import_react.default.createElement(import_react.Suspense, { fallback: /* @__PURE__ */ import_react.default.createElement("div", { className: "xd-loading" }, "\u52A0\u8F7D\u767D\u677F\u4E2D\u2026") }, /* @__PURE__ */ import_react.default.createElement(
    ExcalidrawLazy,
    {
      initialData: { elements: [], appState: { viewBackgroundColor: "#1c1c1e" } },
      UIOptions: { canvasActions: { export: false } }
    }
  ))));
}
function WhiteboardEntry() {
  const [open, setOpen] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("excalidraw:open", onOpen);
    return () => window.removeEventListener("excalidraw:open", onOpen);
  }, []);
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, open && (0, import_react_dom.createPortal)(/* @__PURE__ */ import_react.default.createElement(Whiteboard, { onClose: () => setOpen(false) }), document.body));
}
var inject = ["slots"];
function apply(ctx) {
  console.info("[excalidraw] client loaded");
  if (typeof document !== "undefined" && !document.getElementById(CSS_ID)) {
    const el = document.createElement("style");
    el.id = CSS_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }
  ctx.slots.inject(
    "sidebar.footer.action",
    () => ctx.slots.register(
      {
        name: "sidebar.footer.action",
        id: "excalidraw",
        order: 9,
        label: () => "\u767D\u677F"
      },
      WhiteboardEntry
    )
  );
}

    exports.apply = typeof apply !== 'undefined' ? apply : undefined;
    exports.inject = typeof inject !== 'undefined' ? inject : undefined;
    return module.exports;
  }
});
