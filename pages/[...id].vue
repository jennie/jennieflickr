<template>
  <div v-if="photo" class="photo-page">
    <img :src="photo.url" :alt="photo.title" />
    <div class="photo-info">
      <h1>{{ photo.name }}</h1>
      <p v-html="photo.description" />
      <p>
        {{ $dayjs(photo.date_taken).format("MMMM D, YYYY") }}
        <span v-if="photo.address">
          @
          {{ photo.address }}
        </span>
      </p>
      <div id="comments" v-if="photo.comments.length > 0">
        <h2>Comments</h2>
        <div class="comment" v-for="comment in photo.comments">
          <p class="date">{{ $dayjs(comment.date).format("MMMM D, YYYY") }}</p>
          <p class="text" v-html="comment.comment"></p>
          <p class="user">{{ comment.user }}</p>
        </div>
      </div>
      <div id="tags">
        <h2>Tags</h2>
        <span class="tag" v-for="tag in photo.tags"> {{ tag }}</span>
      </div>
    </div>
  </div>
  <div v-else>Loading photo...</div>
</template>

<script setup>
import { createFaunaClient } from "~/api/faunaClient";
import { fql } from "fauna";

const config = useRuntimeConfig();
const client = createFaunaClient(config.public.faunaSecret);

import { useRoute } from "vue-router";

const route = useRoute();
const photo = ref(null);
const photoId = route.params.id[0];

const fetchPhotoData = async () => {
  const query = fql`photos.firstWhere(.id == ${photoId})`;

  try {
    const response = await client.query(query);
    photo.value = response.data;
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
};

onMounted(fetchPhotoData);
</script>

<style>
h1 {
  @apply text-3xl mt-8;
}
h2 {
  @apply text-base mt-8 uppercase font-bold;
}
#comments,
#tags {
  @apply mt-8;
}
.tag {
  @apply bg-gray-200 rounded-full px-2 py-1 text-sm mr-2;
}

#comments {
  .comment {
    @apply mt-4;
    .date {
      @apply text-xs text-gray-500;
    }
    .text {
      @apply text-sm;
    }
    .user {
      @apply text-xs text-gray-500;
    }
  }
}
</style>
