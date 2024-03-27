import fs from 'fs'
import gulp from 'gulp'
import gulpFile from 'gulp-file'
import { PluginOption } from 'vite'

const ENV = [
  'VITE_SITE_VERSION=0.0.1',
  'VITE_SITE_NAME=LQ',
  'VITE_SITE_ICO=/src/assets/ico/fav.ico',
  '',
  'VITE_DEV_HTTPS=',
  'VITE_BACKEND_PATH=' // 1.1.1.1:8070 或 xx.cn
]

export function vitePluginCreateEnv(): PluginOption {
  return {
    name: 'create-env',
    buildStart() {
      try {
        const envName = '.env'
        fs.readdir('./', (err, fileNames) => {
          if (!err) {
            if (!fileNames.includes(envName)) {
              gulpFile(envName, ENV.join('\n'), { src: true }).pipe(
                gulp.dest('./')
              )
            }
          }
        })
      } catch {}
    }
  }
}
