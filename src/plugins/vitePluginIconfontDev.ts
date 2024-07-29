import { PluginOption } from 'vite'

export function vitePluginIconfontDev(params: { href: string }): PluginOption {
  return {
    name: 'iconfont-dev',
    transformIndexHtml(html) {
      const link = `<link rel="stylesheet" href="${params.href}" />`
      return html.replace('</head>', `${link}</head>`)
    }
  }
}
