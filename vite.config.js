import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import securityHeadersPlugin from './src/api/securityHeadersPlugin.js'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), securityHeadersPlugin()],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
})
