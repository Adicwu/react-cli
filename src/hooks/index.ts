import { startTransition, useRef, useState } from 'react'
import { useMount } from 'react-use'

export const useReloadNode = () => {
  const [rootKey, setRootKey] = useState(1)
  const reload = () => {
    startTransition(() => {
      setRootKey(Math.random())
    })
  }
  return [rootKey, reload] as const
}

export const useElVisible = <T extends Element>() => {
  const root = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useMount(() => {
    if (!root.current) return
    const observer = new IntersectionObserver((entries, observer) => {
      const isIn = entries.some((entrie) => entrie.intersectionRatio > 0)
      if (isIn) {
        observer.unobserve(root.current!)
        setVisible(true)
      }
    })
    observer.observe(root.current)
  })
  return [root, visible] as const
}
