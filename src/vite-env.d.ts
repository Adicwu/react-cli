/// <reference types="vite/client" />

declare module 'gulp-file'

declare type PageMark = import('../page.config').PageMark
declare interface Window {
  /** 页面标识（多页） */
  mark?: PageMark
}

declare interface ImportMetaEnv {
  /** 系统版本 x.x.x */
  readonly VITE_APP_VERSION: string

  /** 产品网站ico */
  readonly VITE_SITE_ICO: string

  /** 开发环境是否开放https */
  readonly VITE_DEV_HTTPS: boolean
  /** 后端地址 */
  readonly VITE_BACKEND_PATH: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** 获取异步函数的返回值 */
declare type AwaitedReturnType<T> = Awaited<ReturnType<T>>

/**
 * 对象值类型
 */
declare type ValueOf<T> = T[keyof T]

declare type PageResult<T> = {
  list: T[]
  page_info: {
    /** 总数 */
    total: number
    /** 总页数 */
    total_page: number
  }
}
declare type PageOrder = 'desc' | 'asc' | ''
declare type PageParams<T> = {
  order_field?: string
  order?: PageOrder
  page: number
  count: number
} & T
