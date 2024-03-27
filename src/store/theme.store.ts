import { create } from 'zustand'

type ThemeType = 'theme-light' | 'theme-dark'

export const useThemeStore = create<{
  theme: ThemeType
  init(): void
  setTheme(theme: ThemeType): void
}>((set, get) => ({
  theme: 'theme-light',
  switchLaD() {
    get().setTheme(get().theme === 'theme-light' ? 'theme-dark' : 'theme-light')
  },
  init() {
    get().setTheme(get().theme)
  },
  setTheme(theme) {
    if (theme !== get().theme) {
      set({
        theme
      })
    }
    document.documentElement.className = theme
  }
}))
