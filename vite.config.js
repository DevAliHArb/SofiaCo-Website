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
  // Vite 8 changed default imports of CommonJS packages (e.g. "@mui/icons-material/Search")
  // to return { default } instead of the component; keep the pre-Vite 8 behaviour.
  legacy: {
    inconsistentCjsInterop: true,
  },
})
