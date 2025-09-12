/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
base: '/', 
  plugins: [
    vue(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5 MB limit
    //   },
    //   manifest: {
    //     name: 'ePOS',
    //     short_name: 'eCoupon',
    //     description: 'eCoupon for Food',
    //     theme_color: '#3880ff',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     // start_url: '/ecoupon/',
    //     icons: [
    //       {
    //         src: '/ecoupon/assets/app_icon.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: '/ecoupon/assets/app_icon.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    // }),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
