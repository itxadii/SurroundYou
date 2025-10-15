import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig ({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['dee0b86def2a.ngrok-free.app'],
  },
})
