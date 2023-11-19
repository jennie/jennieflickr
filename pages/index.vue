<template>
  <div class="gallery">
    <div v-for="photo in photos" :key="photo.id" class="photo">
      <NuxtLink :to="`/${photo.id}`">
        <img :src="photo.url" :alt="photo.title" />
      </NuxtLink>
      <div class="photo-info">
        <h3>{{ photo.name }}</h3>
        <p>{{ photo.description }}</p>
      </div>
    </div>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :changePage="changePage" />
  </div>
</template>

<script setup>
import { createFaunaClient } from "~/api/faunaClient";
import { fql } from "fauna"; // Importing fql directly from the fauna package

const config = useRuntimeConfig();
console.log(config.public);
const client = createFaunaClient(config.public.faunaSecret);

const photos = ref([]);
let after = null;
let currentPage = ref(1);
const count = 9;
const totalPages = ref(0);

const totalPhotos = await client.query(fql`photos.all().count()`);

totalPages.value = Math.ceil(totalPhotos.data / count);

const fetchPhotos = async () => {
  let query;
  if (after !== null && count !== null) {
    query = fql`Set.paginate(${after}, ${Number(count)})`;
  } else if (after !== null) {
    query = fql`Set.paginate(${after})`;
  } else if (count !== null) {
    query = fql`photos.all().paginate(${Number(count)})`;
  }
  try {
    const response = await client.query(query);
    after = response.data.after || null;
    photos.value = response.data.data.map((doc) => {
      return {
        id: doc.id,
        ...doc,
      };
    });
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
};
const changePage = (newPage) => {
  currentPage.value = newPage;
  fetchPhotos();
};

onMounted(() => fetchPhotos());
</script>
<style>
body {
  @apply bg-gray-100 p-10;
}
.gallery {
  @apply grid grid-cols-3 gap-4;
  .photo {
    @apply flex flex-col;
    img {
      @apply w-full h-64 object-cover;
    }
    .photo-info {
      @apply flex flex-col;
      h3 {
        @apply text-lg font-semibold;
      }
      p {
        @apply text-gray-500;
      }
    }
  }
}
</style>
