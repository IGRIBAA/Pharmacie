<script setup>
import Films from './components/Films.vue'
</script>
<template>
  <div class="container">
    <div class="column-1">
      <!-- première colonne -->
      <Films></Films>
    </div>
    <div class="column-2">
      <!-- deuxième colonne -->
    </div>
    <div class="column-3">
      <!-- troisième colonne -->
    </div>
  </div>
</template>

<style scoped>
.container { display: flex; width: 100%; gap: 20px; }
.column-1 { width: 35%; padding: 10px;border: 1px solid #ccc;
  border-radius: 8px; background-color: #f9f9f9;
}
.column-2 { width: 25%; padding: 10px;border: 1px solid #ccc;
  border-radius: 8px;background-color: #f9f9f9;
}
.column-3 {width: 30%;padding: 10px;border: 1px solid #ccc;
  border-radius: 8px;background-color: #f9f9f9;
}
</style>
