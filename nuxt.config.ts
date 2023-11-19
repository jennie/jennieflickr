// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "dayjs-nuxt"],
  runtimeConfig: {
    public: {
      faunaSecret: process.env.FAUNA_SECRET,
    },
  },
});
