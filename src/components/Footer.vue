<template>
  <v-footer color="primary">
    <v-row justify="center" no-gutters>
      <v-col class="text-center mt-4" cols="12">
        <strong>💊 Pharmacie</strong> — Tous droits réservés ©
        {{ new Date().getFullYear() }}
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>
