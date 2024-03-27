import { createEventListener } from '@/utils'
import { addResizeObserver } from '@/utils/addResizeObserver'
import { cn } from '@/utils'
import React, {
  CSSProperties,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { useEvent } from 'react-use'
import { ScrollbarContext } from './const'
import './index.scss'
import { BarProps, ScrollbarProps, ThumbProps } from './type'
import {
  BAR_MAP,
  GAP,
  addUnit,
  isNumber,
  isObject,
  renderThumbStyle
} from './utils'

function scrollTo(xCord: number, yCord?: number): void
function scrollTo(options: ScrollToOptions): void
function scrollTo() {}

type MouseDownEvent = React.MouseEvent<HTMLDivElement, MouseEvent>
type BarExport = { handleScroll: (e: HTMLDivElement) => void }
export type ScrollbarExport = {
  setScrollTop(v: number): void
  setScrollLeft(v: number): void
  update(): void
  scrollTo: typeof scrollTo
  getWrapRef: () => HTMLDivElement | null
}

const isClient = false

const Bar = forwardRef<BarExport, BarProps>(
  ({ ratioX = 1, ratioY = 1, width, height, always } = {}, ref) => {
    const [moveX, setMoveX] = useState(0)
    const [moveY, setMoveY] = useState(0)

    useImperativeHandle(ref, () => ({
      handleScroll(wrap) {
        if (wrap) {
          const offsetHeight = wrap.offsetHeight - GAP
          const offsetWidth = wrap.offsetWidth - GAP

          setMoveX(((wrap.scrollLeft * 100) / offsetWidth) * ratioX)
          setMoveY(((wrap.scrollTop * 100) / offsetHeight) * ratioY)
        }
      }
    }))

    return (
      <>
        <Thumb move={moveX} ratio={ratioX} size={width} always={always} />
        <Thumb
          move={moveY}
          ratio={ratioY}
          size={height}
          vertical
          always={always}
        />
      </>
    )
  }
)
const Thumb = (props: ThumbProps) => {
  const scrollbar = useContext(ScrollbarContext)

  const instance = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLDivElement>(null)

  const thumbState = useRef({
    X: 0,
    Y: 0
  })
  const [visible, setVisible] = useState(false)
  const cursorDown = useRef(false)
  const cursorLeave = useRef(false)
  const originalOnSelectStart = useRef<
    ((this: GlobalEventHandlers, ev: Event) => void) | null
  >(isClient ? document.onselectstart : null)

  const bar = useMemo(
    () => BAR_MAP[props.vertical ? 'vertical' : 'horizontal'],
    [props.vertical]
  )
  const thumbStyle = useMemo(
    () =>
      renderThumbStyle({
        size: props.size,
        move: props.move,
        bar: bar
      }),
    [props.size, props.move, bar]
  )

  const getOffsetRatio = () => {
    return !scrollbar.wrapElement || !instance.current || !thumb.current
      ? 0
      : instance.current[bar.offset] ** 2 /
          scrollbar.wrapElement[bar.scrollSize] /
          props.ratio /
          thumb.current[bar.offset]
  }
  const clickTrackHandler = (e: MouseDownEvent) => {
    if (!thumb.current || !instance.current || !scrollbar.wrapElement) return
    const offsetRatio = getOffsetRatio()
    const offset = Math.abs(
      (e.target as HTMLElement).getBoundingClientRect()[bar.direction] -
        e[bar.client]
    )
    const thumbHalf = thumb.current[bar.offset] / 2
    const thumbPositionPercentage =
      ((offset - thumbHalf) * 100 * offsetRatio) / instance.current[bar.offset]

    scrollbar.wrapElement[bar.scroll] =
      (thumbPositionPercentage * scrollbar.wrapElement[bar.scrollSize]) / 100
  }
  const clickThumbHandler = (e: MouseDownEvent) => {
    // prevent click event of middle and right button
    e.stopPropagation()
    if (e.ctrlKey || [1, 2].includes(e.button)) return

    window.getSelection()?.removeAllRanges()
    startDrag(e)

    const el = e.currentTarget as HTMLDivElement
    if (!el) return
    thumbState.current[bar.axis] =
      el[bar.offset] -
      (e[bar.client] - el.getBoundingClientRect()[bar.direction])
  }
  const startDrag = (e: MouseDownEvent) => {
    e.nativeEvent.stopImmediatePropagation()
    cursorDown.current = true
    document.addEventListener('mousemove', mouseMoveDocumentHandler)
    document.addEventListener('mouseup', mouseUpDocumentHandler)
    originalOnSelectStart.current = document.onselectstart
    document.onselectstart = () => false
  }
  const mouseMoveDocumentHandler = (e: MouseEvent) => {
    if (!instance.current || !thumb.current || cursorDown.current === false)
      return

    const prevPage = thumbState.current[bar.axis]
    if (!prevPage) return

    const offsetRatio = getOffsetRatio()
    const offset =
      (instance.current.getBoundingClientRect()[bar.direction] -
        e[bar.client]) *
      -1
    const thumbClickPosition = thumb.current[bar.offset] - prevPage
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100 * offsetRatio) /
      instance.current[bar.offset]

    scrollbar.wrapElement![bar.scroll] =
      (thumbPositionPercentage * scrollbar.wrapElement![bar.scrollSize]) / 100
  }
  const mouseUpDocumentHandler = () => {
    cursorDown.current = false
    thumbState.current[bar.axis] = 0
    document.removeEventListener('mousemove', mouseMoveDocumentHandler)
    document.removeEventListener('mouseup', mouseUpDocumentHandler)
    restoreOnselectstart()
    if (cursorLeave.current) setVisible(false)
  }
  const mouseMoveScrollbarHandler = () => {
    cursorLeave.current = false
    setVisible(!!props.size)
  }
  const mouseLeaveScrollbarHandler = () => {
    cursorLeave.current = true
    setVisible(cursorDown.current)
  }
  const restoreOnselectstart = () => {
    if (document.onselectstart !== originalOnSelectStart.current)
      document.onselectstart = originalOnSelectStart.current
  }

  useEvent(
    'mousemove',
    mouseMoveScrollbarHandler,
    useMemo(() => scrollbar.scrollbarElement, [scrollbar.scrollbarElement])
  )
  useEvent(
    'mouseleave',
    mouseLeaveScrollbarHandler,
    useMemo(() => scrollbar.scrollbarElement, [scrollbar.scrollbarElement])
  )

  useEffect(() => {
    return () => {
      restoreOnselectstart()
      document.removeEventListener('mouseup', mouseUpDocumentHandler)
    }
  }, [])

  return (
    <div
      className={cn('lqScrollbar-bar', bar.key)}
      ref={instance}
      style={{
        display: props.always || visible ? 'block' : 'none'
      }}
      onMouseDown={clickTrackHandler}
    >
      <div
        className="lqScrollbar-bar__thumb"
        ref={thumb}
        style={thumbStyle}
        onMouseDown={clickThumbHandler}
      ></div>
    </div>
  )
}

const Scrollbar = forwardRef<
  ScrollbarExport,
  {
    className?: string
    style?: CSSProperties
    children?: React.ReactNode
    onScroll?: (e: { scrollTop: number; scrollLeft: number }) => void
  } & ScrollbarProps
>((props, ref) => {
  const {
    // tag = 'div',
    minSize = 20
  } = props

  const scrollbarRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<BarExport>(null)

  let stopResizeObserver = useRef<(() => void) | undefined>(undefined)
  let stopResizeListener = useRef<(() => void) | undefined>(undefined)

  const [sizeWidth, setSizeWidth] = useState('0')
  const [sizeHeight, setSizeHeight] = useState('0')
  const [ratioY, setRatioY] = useState(1)
  const [ratioX, setRatioX] = useState(1)
  const [provider, setProvider] = useState({
    scrollbarElement: document.createElement('div'),
    wrapElement: document.createElement('div')
  })

  const wrapStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = {}
    if (props.height) style.height = addUnit(props.height)
    if (props.maxHeight) style.maxHeight = addUnit(props.maxHeight)
    return {
      ...props.wrapStyle,
      ...style
    }
  }, [props.height, props.maxHeight, props.wrapStyle])

  const handleScroll = () => {
    if (wrapRef.current) {
      barRef.current?.handleScroll(wrapRef.current)

      props.onScroll?.({
        scrollTop: wrapRef.current.scrollTop,
        scrollLeft: wrapRef.current.scrollLeft
      })
    }
  }
  const update = () => {
    if (!wrapRef.current) return
    const offsetHeight = wrapRef.current.offsetHeight - GAP
    const offsetWidth = wrapRef.current.offsetWidth - GAP

    const originalHeight = offsetHeight ** 2 / wrapRef.current.scrollHeight
    const originalWidth = offsetWidth ** 2 / wrapRef.current.scrollWidth
    const height = Math.max(originalHeight, minSize)
    const width = Math.max(originalWidth, minSize)

    setRatioY(
      originalHeight /
        (offsetHeight - originalHeight) /
        (height / (offsetHeight - height))
    )
    setRatioX(
      originalWidth /
        (offsetWidth - originalWidth) /
        (width / (offsetWidth - width))
    )

    setSizeWidth(width + GAP < offsetWidth ? `${width}px` : '')
    setSizeHeight(height + GAP < offsetHeight ? `${height}px` : '')
  }

  useEffect(() => {
    if (props.noresize) {
      stopResizeObserver.current?.()
      stopResizeListener.current?.()
    } else {
      const { stop } = addResizeObserver(resizeRef.current, update)
      stopResizeObserver.current = stop
      stopResizeListener.current = createEventListener(window, 'resize', update)
    }
  }, [props.noresize])
  useEffect(() => {
    setProvider({
      scrollbarElement: scrollbarRef.current!,
      wrapElement: wrapRef.current!
    })

    update()
    if (wrapRef.current) {
      barRef.current?.handleScroll(wrapRef.current)
    }
  }, [props.maxHeight, props.height])

  useImperativeHandle(ref, () => ({
    setScrollTop(value) {
      if (!isNumber(value)) {
        // debugWarn(COMPONENT_NAME, 'value must be a number')
        return
      }
      wrapRef.current!.scrollTop = value
    },
    setScrollLeft(value) {
      if (!isNumber(value)) {
        // debugWarn(COMPONENT_NAME, 'value must be a number')
        return
      }
      wrapRef.current!.scrollLeft = value
    },
    update,
    scrollTo(arg1, arg2?) {
      if (isObject(arg1)) {
        wrapRef.current!.scrollTo(arg1)
      } else if (isNumber(arg1) && isNumber(arg2)) {
        wrapRef.current!.scrollTo(arg1, arg2)
      }
    },
    getWrapRef() {
      return wrapRef.current
    }
  }))

  return (
    <div
      ref={scrollbarRef}
      style={props.style}
      className={cn('lqScrollbar', props.className)}
    >
      <div
        className={cn('lqScrollbar-wrap', props.wrapClass)}
        ref={wrapRef}
        style={wrapStyle}
        onScroll={handleScroll}
      >
        <div
          className={cn('lqScrollbar-view', props.viewClass)}
          style={props.viewStyle}
          ref={resizeRef}
          aria-label={props.ariaLabel}
          aria-orientation={props.ariaOrientation}
        >
          {props.children}
        </div>
      </div>
      <ScrollbarContext.Provider value={provider}>
        <Bar
          ref={barRef}
          height={sizeHeight}
          width={sizeWidth}
          always={props.always}
          ratioX={ratioX}
          ratioY={ratioY}
        />
      </ScrollbarContext.Provider>
    </div>
  )
})

export const LqScrollbar = React.memo(Scrollbar)
