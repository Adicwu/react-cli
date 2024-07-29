import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useUserStore = create(
  immer<{
    token: string
    info: {
      name: string
    }
    updateToken(v: string): void
    updateUserName(v: string): void
  }>((set) => ({
    token: '',
    info: {
      name: 'adicw'
    },
    updateToken(v) {
      set({ token: v })
    },
    updateUserName(v) {
      set((state) => {
        state.info.name = v
      })
    }
  }))
)
