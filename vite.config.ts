import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import { CodeInspectorPlugin } from 'code-inspector-plugin'
import cssnano from 'cssnano'
import { merge } from 'lodash-es'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from 'tailwindcss'
import { UserConfig, defineConfig, loadEnv } from 'vite'
import { LoginPage, Page } from './page.config'
import { vitePluginCreateEnv } from './src/plugins/vitePluginCreateEnv'
import { vitePluginIconfontDev } from './src/plugins/vitePluginIconfontDev'
import { vitePluginRename } from './src/plugins/vitePluginRename'

type UserConfigWithoutPlugins = Omit<UserConfig, 'plugins'>

const resolve = (p: string) => path.resolve(__dirname, p)
const createOutDir = (p: string) => `./dist/${p}`
const entry = Object.entries(Page).reduce((totol, [k, v]) => {
  totol[k.toLowerCase()] = resolve(v.html)
  return totol
}, {})
const loginEntry = {
  login: resolve(LoginPage)
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const baseConfig: UserConfig = {
    base: './',
    plugins: [
      react(),
      CodeInspectorPlugin({
        bundler: 'vite'
      })
      // {
      //   ...eslint({
      //     include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      //     cache: true
      //   }),
      //   apply: 'serve',
      //   enforce: 'post'
      // },
    ],
    css: {
      postcss: {
        plugins: [
          // tailwindcss需始终在前面，请勿调整位置
          tailwindcss,
          autoprefixer({
            overrideBrowserslist: [
              'defaults',
              'not ie > 0',
              'not ie_mob > 0',
              'not dead'
            ]
          }),
          cssnano({
            preset: 'default'
          })
        ]
      }
    },
    resolve: {
      // 路径别名
      alias: {
        '@': resolve('src'),
        '@img': resolve('src/assets/img'),
        '@api': resolve('src/api'),
        '@comp': resolve('src/components'),
        '@type': resolve('types')
      }
    }
  }

  if (command === 'serve') {
    // 开发环境
    const devConfig: UserConfigWithoutPlugins = {
      server: {
        port: 886,
        proxy: {
          '/backend': {
            changeOrigin: true,
            secure: false,
            target: `${env.VITE_DEV_HTTPS ? 'https' : 'http'}://${env.VITE_BACKEND_PATH}/`,
            rewrite: (path) => path.replace(/^\/backend/, '')
          }
        }
      },
      build: {
        rollupOptions: {
          input: {
            ...loginEntry,
            ...entry
          }
        }
      }
    }

    baseConfig.plugins.push(vitePluginCreateEnv())
    if (env.VITE_ICONFONT_DEV_URL) {
      baseConfig.plugins.push(
        vitePluginIconfontDev({
          href: env.VITE_ICONFONT_DEV_URL
        })
      )
    }
    if (env.VITE_DEV_HTTPS) {
      baseConfig.plugins.push(basicSsl())
    }
    return merge(baseConfig, devConfig)
  } else {
    // 生产环境
    const commitId = env.VITE_SITE_COMMIT_ID || ''

    const baseproductConfig: UserConfigWithoutPlugins = {
      logLevel: 'error',
      build: {
        emptyOutDir: true,
        rollupOptions: {
          output: {
            entryFileNames: `js/[hash]-${commitId}.js`,
            chunkFileNames: `js/[hash]-${commitId}.js`,
            assetFileNames(item) {
              if (['.svg', '.css'].some((k) => item.name.includes(k))) {
                return `[ext]/[hash]-${commitId}[extname]`
              }
              return `assets/[hash]-${commitId}[extname]`
            }
          }
        }
      }
    }

    if (mode === 'login') {
      const outDir = createOutDir('login')
      const config: UserConfigWithoutPlugins = {
        build: {
          outDir,
          rollupOptions: {
            input: {
              ...loginEntry
            }
          }
        }
      }

      baseConfig.plugins.push(
        vitePluginRename({
          list: [
            {
              dest: outDir,
              filename: `login.html`,
              rename: 'index.html'
            }
          ]
        })
      )
      return merge(baseConfig, baseproductConfig, config)
    } else {
      const config: UserConfigWithoutPlugins = {
        build: {
          outDir: createOutDir('fe'),
          rollupOptions: {
            input: entry,
            output: {
              // 单独依赖文件拆分
              manualChunks: {}
            }
          }
        }
      }

      baseConfig.plugins.push(visualizer())
      return merge(baseConfig, baseproductConfig, config)
    }
  }
})
