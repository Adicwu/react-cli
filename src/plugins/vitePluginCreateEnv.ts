import fs from 'fs/promises'
import { PluginOption } from 'vite'

const ENV = [
  'VITE_SITE_COMMIT_ID=xx', // string
  'VITE_SITE_VERSION=0.0.1', // string
  'VITE_SITE_NAME=xx', // string
  '',
  'VITE_ICONFONT_DEV_URL=',
  '',
  'VITE_DEV_HTTPS=', // boolean
  'VITE_BACKEND_PATH=/' // 1.1.1.1:8070 或 xx.cn
]

export function vitePluginCreateEnv(): PluginOption {
  return {
    name: 'create-env',
    async buildStart() {
      try {
        const envName = '.env'
        const fileNames = await fs.readdir('./')
        if (!fileNames.includes(envName)) {
          fs.writeFile(envName, ENV.join('\n'))
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
