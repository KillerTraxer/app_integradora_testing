import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 5173
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env': env
    },
    //! DELETE THIS
    build: {
      rollupOptions: {
        output: {
          assetFileNames: '[name]-[hash].[ext]'
        },
        input: {
          main: 'index.html',
          // Agrega otras entradas si es necesario
        },
        assetsInlineLimit: 0,
      }
    }
  }
})
