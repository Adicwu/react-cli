<p align="center">
    <img alt="logo" src="https://api.adicw.cn/static/logo/comic-pc.png" width="120" height="120" style="margin-bottom: 10px;">
</p>
<h1 align="center">React自用脚手架</h1>

<p align="center">一个仅供学习自用的React项目级基座（完善中...）</p>

---

## 构建

> 需要node18或其更高版本

建议使用 `yarn` 或 `pnpm` 进行依赖安装，下面以 `pnpm` 举例：

```bash
pnpm i          # install
pnpm run dev    # dev
pnpm run build  # build
```

## 技术栈

- 👆 React18
- 🌍 Vite
- 💪 TypeScript
- 🍭 Tailwindcss/Sass
- 📖 Zustand
- 🌷 Daisyui
- 🍀 Iconfont

## 功能

- SPA多页。自定义入口与环境；生产环境中登录页独立，由后端控制多页登录权限逻辑
- 自动化路由导入。以标识和入口为基准，按需自动引用对应路由
- 自定义环境变量。全局控制、自动创建（仓库前端文件内默认不携带，生存环境写入到后端环境变量）
- 自定义主题配置（开发中）
- 自定义泛用性组件（开发中）
- react项目痛点处理：优雅深引用值处理/完善的样式方案/一键式媒体资源导入

## 项目结构

```
public
src/
  api/
  assets/
    img/ 图片文件夹
    svg/ .svg文件夹
    font/ 字体文件夹
    css/
      app.scss 当前项目入口样式
      common.scss 项目的通用样式，切勿随意更改
  common/ 项目通用的封装依赖，如：请求
  components/ 公用组件文件夹
  entry/ 多页入口文件夹，具体使用方法会在后面提到
  hooks/ 公用hooks文件夹
  page/ 页面文件夹，具体使用方法会在后面提到
  plugins/ 工程化插件文件夹
  router/ 路由相关功能文件夹
  static/ 静态资源文件夹，如定义的一些选项、枚举
  store/ 全局状态文件夹，具体使用方法会在后面提到
  theme/ 主题文件夹
  utils/ 公用函数文件夹
  vite-env.d.ts 全局ts类型
.env 环境变量，会在第一次成功运行项目后自动创建，具体使用方法会在后面提到
page.config.ts 入口配置文件，后面会细说
```

## 浏览器支持

此项目使用了过多新特性，且暂未做兼容性处理
建议使用主流或 chrome 内核的浏览器，如`Chrome`、`Edge`
