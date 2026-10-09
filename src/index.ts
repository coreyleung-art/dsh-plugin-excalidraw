// dsh-plugin-excalidraw — cordis 标准命名导出
export const name = 'excalidraw';
export const inject = ['slots'];
export interface Config {}

export function apply(_ctx: any, _config: Config) {
  // host 无需服务端逻辑（白板纯前端，client 注册 sidebar slot）
}
