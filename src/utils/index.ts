import classNames from 'classnames'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'
// import utc from 'dayjs/plugin/utc'
// dayjs.extend(utc)

export function jsonParse<T>(v: string | null, df: T): T {
  try {
    return JSON.parse(v || '') || df
  } catch {
    return df
  }
}

export function wait(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

export const createEventListener = (
  target: HTMLElement | Window | null,
  eventName: string,
  cb: (e: Event) => void
) => {
  const destory = () => {
    target?.removeEventListener(eventName, cb)
  }
  if (target) {
    target.addEventListener(eventName, cb)
  }

  return destory
}

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

export const createLastUpdateDiff = (v: number) => {
  const from = v * 1000
  const to = dayjs(new Date())
  const d = to.diff(from, 'day')
  const h = to.diff(from + d * 24 * 60 * 60 * 1000, 'hour')
  const m = to.diff(from, 'minute') - d * 24 * 60 - h * 60
  if (d > 0) {
    return `${d}天前`
  }
  if (h > 0) {
    return `${h}小时前`
  }
  return m <= 0 ? '刚才' : `${m} 分钟前`
}

export function splitWith(str?: string, type = ',') {
  return String(str)
    .split(type)
    .filter((item) => item)
}

export function splitWithLF(str?: string) {
  return splitWith(str, '\n')
}

export function mergeUrlQuery<T extends object>(url: string, query: T) {
  const qs = Object.entries(query)
    .map(([k, v]) => {
      if (v instanceof Array) {
        return !v.length
          ? ''
          : v.map((item) => `${k}=${encodeURIComponent(item)}`).join('&')
      } else {
        return v === '' ? '' : `${k}=${encodeURIComponent(v)}`
      }
    })
    .filter((item) => item !== '')
  return !qs.length ? url : url + '?' + qs.join('&')
}

export const getLocationSearchParams = () => {
  return new URL(location.href).searchParams
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

export function cn(...args: classNames.ArgumentArray) {
  return twMerge(classNames(args))
}

/**
 * 监听节点是否存在于当前屏幕视野
 * @param el 监听的节点
 * @returns
 */
export function domObserver(el: HTMLElement, callback: () => void) {
  const observer = new IntersectionObserver((entries, observer) => {
    const isIn = entries.some((entrie) => entrie.intersectionRatio > 0)
    if (isIn) {
      // 解绑
      observer.unobserve(el)
      callback()
    }
  })
  observer.observe(el)
  return observer
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
    // 有兼容性问题
    // if (typeof e.keyCode !== 'undefined') {
    //   if (e.keyCode === 13) {
    //     cb()
    //   } else if (e.keyCode === 229) {
    //     !e.nativeEvent.isComposing && cb()
    //   }
    // } else {
    //   cb()
    // }
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

export function fileDownload(
  param: {
    data: Blob
    type: string
    name: string
  },
  options: { transcode: string } = { transcode: '\ufeff' }
) {
  const url = URL.createObjectURL(
    new Blob([options.transcode, param.data], {
      type: param.type
    })
  )
  const dom = document.createElement('a')
  dom.href = url

  dom.download = decodeURI(param.name).replace(new RegExp('"', 'g'), '')
  dom.style.display = 'none'

  document.body.appendChild(dom)
  dom.click()
  document.body.removeChild(dom)
  URL.revokeObjectURL(url)
}
