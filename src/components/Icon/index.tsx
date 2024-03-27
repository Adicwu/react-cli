import { cn } from '@/utils'
import React, { CSSProperties, useMemo } from 'react'
import './index.scss'

export const Icon = React.memo(
  ({
    size = 16,
    name,
    className,
    onClick,
    style,
    title,
    control,
    svg
  }: {
    name: string
    size?: number
    className?: string
    style?: CSSProperties
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    title?: string
    control?: boolean
    svg?: boolean
  }) => {
    const rootStyle = useMemo(() => {
      const finalSize = `${size}px`
      return {
        width: finalSize,
        height: finalSize,
        fontSize: finalSize,
        ...(style || {})
      } as CSSProperties
    }, [])
    const fullName = useMemo(
      () => (svg ? `#asm-${name}` : `asm-${name}`),
      [name]
    )
    return svg ? (
      <svg aria-hidden style={rootStyle}>
        <use xlinkHref={fullName} />
      </svg>
    ) : (
      <i
        className={cn(
          'iconfont-asm icon',
          className,
          control && 'icon-control',
          fullName
        )}
        style={rootStyle}
        title={title}
        onClick={onClick}
      ></i>
    )
  }
)

export const IconLoading = React.memo(({ size = 16 }: { size?: number }) => {
  const svgStyle = useMemo<CSSProperties>(
    () => ({
      width: `${size}px`,
      height: `${size}px`
    }),
    []
  )
  return (
    <svg
      className="icon-loading"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      data-v-ea893728=""
      style={svgStyle}
    >
      <path
        fill="currentColor"
        d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
      ></path>
    </svg>
  )
})
