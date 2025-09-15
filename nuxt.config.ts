import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  app: {
    head: {
      title: 'GSEED',
      meta: [
        { name: 'description', content: 'GSEED 페이지입니다.' },
        { name: 'keywords', content: 'GSEED, 페이지' },
        { name: 'author', content: 'GSEED' },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }        
      ],
    },
  },
  // Firebase 설정
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    }
  },
  css: [
    '~/assets/scss/main.scss',
    '~/assets/css/tailwind.css',
    "font-awesome/css/font-awesome.min.css"
  ],
  plugins: [
    '~/plugins/firebase.js',
    '~/plugins/auth.client.js'
  ],
  modules: [     
    '@pinia/nuxt'
  ],  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});