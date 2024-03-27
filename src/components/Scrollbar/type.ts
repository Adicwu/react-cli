import { CSSProperties } from 'react'

export interface ThumbProps {
  vertical?: boolean
  size?: string
  move?: number
  ratio: number
  always?: boolean
}

export type BarProps = Partial<{
  always: boolean
  width: string
  height: string
  ratioX: number
  ratioY: number
}>

export type ScrollbarProps = Partial<{
  height: string | number
  maxHeight: string | number
  wrapStyle: CSSProperties
  viewStyle: CSSProperties
  wrapClass: string | string[]
  viewClass: string | string[]
  noresize: boolean
  tag: string // 'div'
  always: boolean
  minSize: number // 20
  id: string
  ariaLabel: string
  ariaOrientation: 'horizontal' | 'vertical'
}>
