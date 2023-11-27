// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "dayjs-nuxt", "@nuxt/image"],
  runtimeConfig: {
    public: {
      faunaSecret: process.env.FAUNA_SECRET,
    },
  },
  image: {
    imgix: {
      baseURL: "https://jennie.imgix.net",
    },
  },
});
