import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      // 状态
      user: null,
      userType: null, // 'patient', 'doctor', 'admin'
      isLoggedIn: false,
      theme: 'light', // 'light' or 'dark'

      // 登录
      login: (user, userType) => {
        set({
          user,
          userType,
          isLoggedIn: true,
        })
      },

      // 登出
      logout: () => {
        set({
          user: null,
          userType: null,
          isLoggedIn: false,
        })
      },

      // 更新用户信息
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }))
      },

      // 切换主题
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          // 更新DOM class
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { theme: newTheme }
        })
      },

      // 初始化主题
      initTheme: () => {
        set((state) => {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark')
          }
          return state
        })
      },
    }),
    {
      name: 'pegasus-hospital-user',
    }
  )
)
