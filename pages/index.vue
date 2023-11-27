<template>
  <div class="flex flex-wrap flex-row">
    <div class="md:w-1/3">
      <Tags
        :tagsWithCounts="tagsWithCounts"
        :selectedTag="selectedTag"
        @filterByTag="filterByTag" />
    </div>
    <div class="md:w-2/3">
      <div v-if="selectedTag" class="selected-tag text-center font-bold">
        Filtered by: "{{ selectedTag }}"
      </div>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        :changePage="changePage" />
      <div class="gallery">
        <div v-for="photo in photos" :key="photo.id" class="photo">
          <NuxtLink :to="`/${photo.id}`">
            <NuxtImg
              provider="imgix"
              :src="
                photo.url
                  ? photo.url.replace(
                      'https://jennieflickr.nyc3.cdn.digitaloceanspaces.com/',
                      ''
                    )
                  : '001_9852584_o.jpg'
              "
              width="200"
              height="200"
              fit="cover"
              :alt="photo.title"
              :modifiers="{
                auto: 'format,compress',
              }" />

            <!-- <img :src="photo.url" :alt="photo.title" /> -->
          </NuxtLink>
          <!-- <div class="photo-info">
            <h3>{{ photo.name }}</h3>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createFaunaClient } from "~/api/faunaClient";
import { fql } from "fauna";

const config = useRuntimeConfig();
const client = createFaunaClient(config.public.faunaSecret);

let photos = ref([]);
let selectedTag = ref(null);
let tagsWithCounts = ref([]);

let after = null;
let currentPage = ref(1);
const count = 10;
const totalPages = ref(0);

const fetchPhotosByTag = async () => {
  let query;
  if (selectedTag.value) {
    query = fql`let photos = photos.photosByTag(${selectedTag.value}).order(desc(.date_taken)) {url, id}; photos.paginate(${count})`;
    if (after !== null && count !== null) {
      query = fql`Set.paginate(${after}, ${count})`;
    }
  } else {
    // Handle case where no tag is selected if needed
  }

  try {
    const response = await client.query(query);
    after = response.data.after || null;
    photos.value = response.data.data.map((doc) => ({
      id: doc.id,
      ...doc,
    }));
  } catch (error) {
    console.error(
      `Error fetching photos${selectedTag.value ? " by tag" : ""}:`,
      error
    );
  }
};

const filterByTag = (tag, countOfTag) => {
  console.log("filterByTag", tag, countOfTag);
  selectedTag.value = tag;
  currentPage.value = 1;
  totalPages.value = Math.ceil(countOfTag / count);

  after = null; // Reset the 'after' variable
  fetchPhotosByTag();
};

const changePage = (newPage) => {
  currentPage.value = newPage;
  fetchPhotosByTag();
};

// Removed onMounted hook
</script>

<style>
body {
  @apply bg-gray-100 p-10;
  a {
    @apply text-red-500 underline underline-offset-1;
  }
}
.gallery {
  @apply grid grid-cols-5 gap-4;
  .photo {
    @apply flex flex-col;
    img {
      /* @apply w-full h-64 object-cover; */
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
