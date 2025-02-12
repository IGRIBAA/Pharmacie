<script setup>
import { ref } from 'vue';

const texte = ref('');
const emit = defineEmits(['eventSubmit']);

</script>

<template>
  <form @submit.prevent="$emit('eventSubmit', texte)">
    <input v-model="texte" type="text" placeholder="critere de recherche" />
    <button type="submit">Rechercher</button>
  </form>
</template>