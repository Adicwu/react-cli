import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useUserStore = create(
  // persist(
  //   immer<{
  //     token: string
  //     info: {
  //       name: string
  //     }
  //     updateToken(v: string): void
  //     updateUserName(v: string): void
  //   }>((set) => ({
  //     token: '48276bed-f568-4d7c-ba42-84b44f8fcfc0URvUwbrunHOOzNiw',
  //     info: {
  //       name: 'adicw'
  //     },
  //     updateToken(v) {
  //       set({ token: v })
  //     },
  //     updateUserName(v) {
  //       set((state) => {
  //         state.info.name = v
  //       })
  //     }
  //   })),
  //   {
  //     name: 'token',
  //     storage: createJSONStorage(() => localStorage),
  //     partialize: (state) => state.token
  //   }
  // )
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
