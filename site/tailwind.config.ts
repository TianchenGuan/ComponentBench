import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // DO NOT include src/runners/ — those use Ant Design/MUI/Mantine inline
  theme: {
    extend: {
      colors: {
        // Observation mode colors
        'mode-axtree': '#6366f1',    // indigo
        'mode-som': '#f59e0b',       // amber
        'mode-pixel': '#f43f5e',     // rose
        'mode-browseruse': '#14b8a6', // teal
        // Version colors
        'bench-v1': '#10b981',       // emerald
        'bench-core': '#f97316',     // orange
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
