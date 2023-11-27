<template>
  <div class="tags">
    <button
      v-for="tagInfo in tagsWithCounts"
      :key="tagInfo.tag"
      :class="{ active: tagInfo.tag === selectedTag }"
      @click="$emit('filterByTag', tagInfo.tag, tagInfo.count)"
      class="tag-button">
      {{ tagInfo.tag }} ({{ tagInfo.count }})
    </button>
  </div>
</template>

<script setup>
let tagsWithCounts = ref([]);

const props = defineProps({
  tagsWithCounts: Array,
  selectedTag: String,
});

import { ref, onMounted } from "vue";
import { createFaunaClient } from "~/api/faunaClient";
import { fql } from "fauna";

const config = useRuntimeConfig();
const client = createFaunaClient(config.public.faunaSecret);

const fetchTags = async () => {
  try {
    // Adjust the query to fetch up to 500 tags
    const response = await client.query(fql`tags.all().paginate(500)`);
    tagsWithCounts.value = response.data.data.map((tagDoc) => ({
      tag: tagDoc.tag,
      count: tagDoc.count,
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};

onMounted(fetchTags);
</script>

<style>
button {
  @apply bg-gray-200 px-4 py-2 rounded-md m-2;
  &.active {
    @apply bg-red-400;
  }
}
</style>
