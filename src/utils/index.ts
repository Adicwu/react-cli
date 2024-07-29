import classNames from 'classnames'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'

/**
 * 安全的json解析
 * @param v
 * @param df
 * @returns
 */
export function jsonParse<T>(v: string | null, df: T): T {
  try {
    return JSON.parse(v || '') || df
  } catch {
    return df
  }
}

/**
 * 日期展示格式化
 * @param d
 * @param type
 * @returns
 */
export function dateFormat(d: number, type = 'YYYY/MM/DD HH:mm:ss') {
  return dayjs.unix(d).format(type)
}

/**
 * 节点事件节流，基于requestAnimationFrame，常用于scroll
 * @param cb
 * @returns
 */
export function eventThrottle<T extends unknown[]>(cb: (...args: T) => void) {
  let bool = false
  return function (this: unknown, ...args: T) {
    if (bool) return
    bool = true
    window.requestAnimationFrame(() => {
      cb.apply(this, args)
      bool = false
    })
  }
}

/**
 * 字符串拆分
 * @param str
 * @param type
 * @returns
 */
export function splitWith(str?: string, type = ',') {
  return String(str)
    .split(type)
    .filter((item) => item)
}

/**
 * 字符串换行拆分
 * @param str
 * @returns
 */
export function splitWithLF(str?: string) {
  return splitWith(str, '\n')
}

/**
 * url+query对象合并为整体字符串
 * @param url
 * @param query
 * @param config
 * @returns
 */
export function mergeUrlQuery<T extends object>(
  url: string,
  query: T,
  config?: {
    encodeValue?: boolean
  }
) {
  const qs = Object.entries(query)
    .map(([k, v]) => {
      if (v instanceof Array) {
        return !v.length
          ? ''
          : v
              .map(
                (item) =>
                  `${k}=${
                    config?.encodeValue ? encodeURIComponent(item) : item
                  }`
              )
              .join('&')
      } else {
        return typeof v === 'undefined' || v === ''
          ? ''
          : `${k}=${config?.encodeValue ? encodeURIComponent(v) : v}`
      }
    })
    .filter((item) => item !== '')
  return !qs.length ? url : url + '?' + qs.join('&')
}

/**
 * 将内容复制到粘贴板
 * @param text
 */
export function copyText(text: string | number) {
  const save = (e: ClipboardEvent) => {
    e.clipboardData!.setData('text/plain', text.toString())
    e.preventDefault()
  }
  document.addEventListener('copy', save)
  document.execCommand('copy')
  document.removeEventListener('copy', save)
}

/**
 * 样式合并
 * @param args
 * @returns
 */
export function cn(...args: classNames.ArgumentArray) {
  return twMerge(classNames(args))
}

/**
 * 输入框回车监听（解决mac中文输入时回车问题），需要配合input的 onKeyDown 事件
 * @param cb
 * @returns
 */
export function onInputPressEnter(
  cb: (e: React.KeyboardEvent<HTMLInputElement>) => void
) {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    const root = e.nativeEvent.target! as HTMLInputElement &
      Partial<{
        hasCnInputEnterEvent: boolean
        cnInputing: boolean
      }>
    if (!root.hasCnInputEnterEvent) {
      root.hasCnInputEnterEvent = true
      root.addEventListener('compositionstart', () => {
        root.cnInputing = true
      })
      root.addEventListener('compositionend', () => {
        root.cnInputing = false
      })
    }
    if (e.key === 'Enter' && !root.cnInputing) {
      cb(e)
    }
  }
}
