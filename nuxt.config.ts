// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      script: [
        { src: '/libs/CCapture.all.min.js' }
      ]
    }
  },  
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style/_config.scss" as *;'
        }
      }
    }
  },
  modules: ['nuxt-svgo']
})

