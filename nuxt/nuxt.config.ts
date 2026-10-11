// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  srcDir: 'app',
  devtools: { enabled: false },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Susi Air - Pilot App',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: 'Susi Air Pilot Operations and Roster Portal' }
      ]
    }
  },
  nitro: {
    preset: 'vercel',
  },
  css: [
    '~/assets/scss/main.scss'
  ],
  modules: [
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001'
    }
  }
})
