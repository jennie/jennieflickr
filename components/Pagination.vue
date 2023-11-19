<template>
  <div class="pagination">
    <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
      Previous
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      :disabled="currentPage >= totalPages"
      @click="changePage(currentPage + 1)">
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    changePage: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
