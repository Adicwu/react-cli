import { useMount, useUnmount } from 'react-use'

export enum StashType {
  TaskTarget = -1,
  Xss = 2
}
interface Set {
  (k: StashType.TaskTarget, v: string[]): void
  (k: StashType.Xss, v: boolean): void
}
interface UseStashListener {
  (k: StashType.TaskTarget, cb: (e: string[]) => void): void
  (k: StashType.Xss, cb: (e: boolean) => void): void
}

const stash = new Map<StashType, unknown>()

export const set: Set = (k, v) => {
  stash.set(k, v)
}

export const useStashListener: UseStashListener = (k, cb) => {
  useMount(() => {
    stash.has(k) && cb(stash.get(k) as any)
  })
  useUnmount(() => {
    stash.delete(k)
  })
}
