import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'classic'
    })
  ],
  publicDir: 'static',
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
}))
