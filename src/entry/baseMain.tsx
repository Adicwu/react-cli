import '@/assets/css/app.scss'
import '@/assets/css/common.scss'
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js'
import '@/theme'
import { enableMapSet } from 'immer'
import React from 'react'
import ReactDOM from 'react-dom/client'
enableMapSet()

export const createBaseMain = ({
  root,
  mark
}: {
  root: () => React.ReactNode
  mark?: PageMark
}) => {
  if (mark) {
    Object.defineProperty(window, 'mark', {
      value: mark,
      writable: false
    })
  }

  ReactDOM.createRoot(document.getElementById('app')!).render(root())
}
