import { createContext } from 'react'

export const ScrollbarContext = createContext({
  scrollbarElement: null as HTMLElement | null,
  wrapElement: null as HTMLElement | null
})
