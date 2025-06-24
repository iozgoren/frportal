import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      port: 5173
    },
    allowedHosts: [
      'localhost',
      '.replit.dev',
      '32067c60-017e-44db-83cf-89d522d3c801-00-1nocsez6zse53.sisko.replit.dev'
    ]
  }
})
