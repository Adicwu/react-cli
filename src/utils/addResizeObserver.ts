export interface ResizeObserverSize {
  readonly inlineSize: number
  readonly blockSize: number
}

export interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

export type ResizeObserverCallback = (
  entries: ReadonlyArray<ResizeObserverEntry>,
  observer: ResizeObserver
) => void

export interface UseResizeObserverOptions {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), `border-box` and `device-pixel-content-box`.
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback)
  disconnect(): void
  observe(target: Element, options?: UseResizeObserverOptions): void
  unobserve(target: Element): void
}

export function addResizeObserver(
  target: HTMLElement | null,
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {}
) {
  let observer: ResizeObserver | null

  const cleanup = () => {
    if (observer) {
      observer?.disconnect()
      observer = null
    }
  }

  if (target) {
    observer = new ResizeObserver(callback)
    observer!.observe(target, options)
  }

  const stop = () => {
    cleanup()
  }

  return {
    stop
  }
}
