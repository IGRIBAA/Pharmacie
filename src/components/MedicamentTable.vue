<template>
  <v-table>
    <thead>
      <tr>
        <th>Nom</th>
        <th>Forme</th>
        <th>Quantité</th>
        <th>Image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="med in medicaments" :key="med.id">
        <td>{{ med.denomination }}</td>
        <td>{{ med.formepharmaceutique }}</td>
        <td>
          <strong>{{ med.qte }}</strong> unités
        </td>
        <td>
          <img
            :src="`https://apipharmacie.pecatte.fr/images/${med.photo}`"
            width="50"
          />
        </td>
        <td class="action-buttons">
          <v-btn class="v-btn--danger" @click="supprimer(med.id)"
            >❌ Supprimer</v-btn
          >
          <v-btn class="v-btn--info" @click="ouvrirFormulaireModification(med)"
            >✏️ Modifier</v-btn
          >
          <v-btn class="v-btn--success" @click="ajouterQte(med.id, med.qte)"
            >➕ Ajouter 1</v-btn
          >
          <v-btn class="v-btn--warning" @click="diminuerQte(med.id, med.qte)"
            >➖ Retirer 1</v-btn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  props: {
    medicaments: {
      type: Array,
      required: true,
    },
  },
  methods: {
    supprimer(id) {
      this.$emit("supprimer", id);
    },
    ouvrirFormulaireModification(med) {
      this.$emit("ouvrirFormulaireModification", med);
    },
    ajouterQte(id, qte) {
      this.$emit("ajouterQte", id, qte);
    },
    diminuerQte(id, qte) {
      this.$emit("diminuerQte", id, qte);
    },
  },
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>
