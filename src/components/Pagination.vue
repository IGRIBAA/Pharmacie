<template>
  <v-pagination
    :modelValue="modelValue"
    :length="totalPages"
    @update:modelValue="updatePage"
    class="mt-4"
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    updatePage(page) {
      this.$emit("update:modelValue", page);
    },
  },
};
</script>
