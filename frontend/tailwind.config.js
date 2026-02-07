/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 参考 ChatGPT 风格的蓝白配色
        primary: {
          DEFAULT: '#1677ff', // Ant Design Default Blue (Blue-6)
          foreground: '#ffffff',
          hover: '#4096ff',   // Blue-5
          // Ant Design Blue Palette
          50: '#f0f5ff',
          100: '#e6f4ff',
          200: '#bae0ff',
          300: '#91caff',
          400: '#69b1ff',
          500: '#4096ff',
          600: '#1677ff', // Main
          700: '#0958d9',
          800: '#003eb3',
          900: '#002c8c',
          950: '#001d66',
        },
        // 背景色体系
        background: {
          DEFAULT: '#f8fafc', // slate-50 (页面背景)
          paper: '#ffffff',   // 纯白 (卡片背景)
          subtle: '#f1f5f9',  // slate-100 (次级背景/侧边栏)
        },
        // 文字颜色体系
        text: {
          main: '#0f172a',    // slate-900 (主要文字)
          secondary: '#64748b', // slate-500 (次要文字)
          muted: '#94a3b8',   // slate-400 (弱提示)
        },
        // 边框
        border: '#e2e8f0',    // slate-200
        // 暗色模式 - 使用扁平化命名以支持 @apply
        'dark-bg': '#0f172a',      // slate-900
        'dark-surface': '#1e293b', // slate-800
        'dark-border': '#334155',  // slate-700
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'float': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 关键：禁用 Tailwind 的 Base Styles，防止与 Ant Design 样式冲突
  }
}
