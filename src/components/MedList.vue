<template>
  <v-container class="pa-6">
    <h1 class="text-center text-h4 font-weight-bold mb-6">
      Gestion de la Parapharmacie
    </h1>

    <!-- Barre de Recherche -->
    <v-text-field
      v-model="search"
      label="Rechercher un médicament"
      clearable
      @input="filtrerMedicaments"
      prepend-inner-icon="mdi-magnify"
      outlined
      class="mb-6"
    ></v-text-field>

    <!-- Tableau des Médicaments -->
    <v-card class="elevation-3 rounded-lg">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Nom</th>
            <th class="text-left">Forme</th>
            <th class="text-left">Quantité</th>
            <th class="text-left">Image</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <MedicamentItem
            v-for="med in medicamentsFiltres"
            :key="med.id"
            :med="med"
            @supprimer="supprimerMedicament"
            @modifier="ouvrirModification"
            @ajouter-qte="ajouterQuantite"
            @diminuer-qte="diminuerQuantite"
          />
        </tbody>
      </v-table>
    </v-card>

    <!-- Bouton pour Ajouter un Médicament -->
    <v-row justify="center" class="mt-6">
      <v-btn color="primary" @click="dialogAjout = true" class="elevation-2">
        <v-icon left>mdi-plus</v-icon>
        Ajouter un médicament
      </v-btn>
    </v-row>

    <!-- Formulaire d'Ajout -->
    <AjoutMedicament
      :dialogAjout="dialogAjout"
      @update:dialogAjout="dialogAjout = $event"
      @ajouter="ajouterMedicament"
    />
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import {
  getMedicaments,
  supprimerMedicament,
  modifierQuantite,
} from "../API/Api.js";
import MedicamentItem from "./MedicamentItem.vue";
import AjoutMedicament from "./AjoutMedicament.vue";

export default {
  components: { MedicamentItem, AjoutMedicament },
  setup() {
    const medicaments = ref([]);
    const search = ref("");
    const dialogAjout = ref(false);

    // Charger les médicaments au montage du composant
    onMounted(async () => {
      medicaments.value = await getMedicaments();
    });

    // Filtrer les médicaments en fonction de la recherche
    const medicamentsFiltres = computed(() => {
      if (!search.value) return medicaments.value;
      return medicaments.value.filter((med) =>
        med.denomination.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    // Supprimer un médicament
    const supprimerMedicament = async (id) => {
      await supprimerMedicament(id);
      medicaments.value = await getMedicaments(); // Recharger la liste
    };

    // Ajouter ou diminuer la quantité
    const ajouterQuantite = async (id, qteActuelle) => {
      await modifierQuantite(id, qteActuelle + 1);
      medicaments.value = await getMedicaments(); // Recharger la liste
    };

    const diminuerQuantite = async (id, qteActuelle) => {
      if (qteActuelle > 0) {
        await modifierQuantite(id, qteActuelle - 1);
        medicaments.value = await getMedicaments(); // Recharger la liste
      }
    };

    // Ajouter un médicament
    const ajouterMedicament = async () => {
      medicaments.value = await getMedicaments(); // Recharger la liste
    };

    return {
      search,
      dialogAjout,
      medicamentsFiltres,
      supprimerMedicament,
      ajouterQuantite,
      diminuerQuantite,
      ajouterMedicament,
    };
  },
};
</script>

<style scoped>
.v-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

h1 {
  color: #4caf50;
}

.v-table {
  background-color: white;
}

.v-btn {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
