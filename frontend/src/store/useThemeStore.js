import { create } from 'zustand'
const savedTheme = localStorage.getItem('theme')
const initialIsDark = savedTheme === 'dark'

if (initialIsDark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const useThemeStore = create((set) => ({
  isDark: initialIsDark,
  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark
      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      return { isDark: next }
    }),
}))

export default useThemeStore
