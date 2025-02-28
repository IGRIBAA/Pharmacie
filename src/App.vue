<template>
  <v-container>
    <h1 class="text-center">Gestion de la Pharmacie</h1>

    <!-- TABLEAU DES MÉDICAMENTS -->
    <v-table>
      <thead>
        <tr>
          <th style="width: 20%">Nom</th>
          <th style="width: 15%">Forme</th>
          <th style="width: 10%">Quantité</th>
          <th style="width: 15%">Image</th>
          <th style="width: 40%">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="med in medicaments" :key="med.id">
          <td>{{ med.denomination }}</td>
          <td>{{ med.formepharmaceutique }}</td>
          <td>{{ med.qte }}</td>
          <td>
            <img
              :src="`https://apipharmacie.pecatte.fr/images/${med.photo}`"
              width="50"
            />
          </td>
          <td>
            <v-btn color="red" class="ma-2" @click="supprimerMedicament(med.id)"
              >Supprimer</v-btn
            >
            <v-btn color="blue" class="ma-2" @click="modifierMedicament(med)"
              >Modifier</v-btn
            >
            <v-btn color="green" class="ma-2" @click="ajouterQte(med.id)"
              >+1</v-btn
            >
            <v-btn color="orange" class="ma-2" @click="diminuerQte(med.id)"
              >-1</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- BOUTON POUR AJOUTER UN MÉDICAMENT (BIEN POSITIONNÉ) -->
    <v-row justify="center" class="mt-4">
      <v-btn color="primary" @click="dialog = true"
        >Ajouter un médicament</v-btn
      >
    </v-row>

    <!-- FORMULAIRE D'AJOUT (DIALOGUE) -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Ajouter un Médicament</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="nouveauMed.denomination"
            label="Nom"
          ></v-text-field>
          <v-text-field
            v-model="nouveauMed.formepharmaceutique"
            label="Forme"
          ></v-text-field>
          <v-text-field
            v-model="nouveauMed.qte"
            type="number"
            label="Quantité"
          ></v-text-field>
          <v-file-input label="Photo" @change="handleFileUpload"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="dialog = false">Annuler</v-btn>
          <v-btn color="green" @click="ajouterMedicament">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  getMedicaments,
  ajouterMedicament,
  supprimerMedicament,
  modifierQuantite,
} from "/project/workspace/src/API/Api.js";

export default {
  setup() {
    const medicaments = ref([]);
    const search = ref("");
    const dialog = ref(false);
    const nouveauMed = ref({
      denomination: "",
      formepharmaceutique: "",
      qte: 1,
      photo: "",
    });

    // Charger les médicaments avec XMLHttpRequest
    const chargerMedicaments = () => {
      getMedicaments((data) => {
        medicaments.value = data;
      }, search.value);
    };

    // Ajouter un médicament
    const ajouter = () => {
      ajouterMedicament(nouveauMed.value, () => {
        chargerMedicaments();
        dialog.value = false;
        nouveauMed.value = {
          denomination: "",
          formepharmaceutique: "",
          qte: 1,
          photo: "",
        };
      });
    };

    // Supprimer un médicament
    const supprimer = (id) => {
      supprimerMedicament(id, chargerMedicaments);
    };

    // Modifier la quantité
    const ajouterQte = (id) => {
      modifierQuantite(id, 1, chargerMedicaments);
    };
    const diminuerQte = (id) => {
      modifierQuantite(id, -1, chargerMedicaments);
    };

    onMounted(chargerMedicaments);

    return {
      medicaments,
      search,
      chargerMedicaments,
      ajouter,
      supprimer,
      ajouterQte,
      diminuerQte,
      dialog,
      nouveauMed,
    };
  },
};
</script>

<style scoped>
<style>
/* 🌿 Styles globaux */
h1 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

/* 📜 Styles du tableau */
.v-table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.v-table th {
  background: #007bff;
  color: white;
  font-weight: bold;
  text-align: left;
  padding: 10px;
}

.v-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}
</style>
