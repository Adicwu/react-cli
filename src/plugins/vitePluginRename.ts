import fs from 'fs/promises'
import { PluginOption } from 'vite'

export function vitePluginRename(params: {
  list: {
    dest: string
    filename: string
    rename: string
  }[]
}): PluginOption {
  return {
    name: 'rename',
    closeBundle() {
      try {
        params.list.forEach((item) => {
          fs.rename(
            `${item.dest}/${item.filename}`,
            `${item.dest}/${item.rename}`
          )
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
