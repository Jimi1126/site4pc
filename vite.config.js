import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import'
import viteCompression from 'vite-plugin-compression'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        sourcemap: false,
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          // id为文件的绝对路径
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    createSvgIconsPlugin({
      // eslint-disable-next-line no-undef
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]'
    }),
    splitVendorChunkPlugin(),
    // viteCompression({
    //   verbose: true,
    //   disable: false,
    //   deleteOriginFile: true,
    //   filter: new RegExp('.(js|mjs|json|css|ttf)$', 'i'),
    //   threshold: 1024 * 5,
    //   algorithm: 'gzip',
    //   ext: '.gz'
    // }),
    // visualizer({
    //   emitFile: false,
    //   filename: 'stats.html',
    //   open: true,
    //   sourcemap: true
    // }),
    importToCDN({
      modules: [
        autoComplete('vue'),
        {
          name: 'pinia',
          var: 'pinia',
          path: 'https://unpkg.com/pinia@2.1.7'
        },
        {
          name: 'vue-router',
          var: 'vue-router',
          path: 'https://cdn.jsdelivr.net/npm/vue-router@4.2.5/dist/vue-router.global.min.js'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: '@import "./src/assets/element/style/index.scss";'
      }
    }
  },
  server: {
    proxy: {
      '/rest': {
        target: 'http://localhost:3000',
        changeOrigin: true //支持跨域
      },
      '/file': {
        target: 'http://localhost:3000',
        changeOrigin: true //支持跨域
      }
    }
  }
})
