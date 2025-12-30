import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import securityHeadersPlugin from './src/api/securityHeadersPlugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), securityHeadersPlugin()],
})
