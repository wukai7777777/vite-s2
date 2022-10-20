import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// import commonjs from 'vite-plugin-commonjs'
// console.log('wukai----', commonjs);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  devtool: "source-map",
})
