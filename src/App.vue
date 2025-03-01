<template>
  <v-container>
    <h1 class="text-center">Gestion de la Pharmacie</h1>

    <!-- BARRE DE RECHERCHE -->
    <v-text-field
      v-model="search"
      label="Rechercher un médicament"
      clearable
      @input="chargerMedicaments"
      class="mb-4"
    />

    <!-- TABLEAU DES MÉDICAMENTS -->
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
          <td>{{ med.qte }}</td>
          <td>
            <img :src="`https://apipharmacie.pecatte.fr/images/${med.photo}`" width="50" />
          </td>
          <td>
            <v-btn color="red" class="ma-2" @click="supprimer(med.id)">Supprimer</v-btn>
            <v-btn color="blue" class="ma-2" @click="ouvrirModification(med)">Modifier</v-btn>
            <v-btn color="green" class="ma-2" @click="ajouterQte(med.id)">+1</v-btn>
            <v-btn color="orange" class="ma-2" @click="diminuerQte(med.id)">-1</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- BOUTON POUR AJOUTER UN MÉDICAMENT -->
    <v-row justify="center" class="mt-4">
      <v-btn color="primary" @click="dialogAjout = true">Ajouter un médicament</v-btn>
    </v-row>

    <!-- FORMULAIRE D'AJOUT -->
    <v-dialog v-model="dialogAjout" max-width="500">
      <v-card>
        <v-card-title>Ajouter un Médicament</v-card-title>
        <v-card-text>
          <v-text-field v-model="nouveauMed.denomination" label="Nom"></v-text-field>
          <v-text-field v-model="nouveauMed.formepharmaceutique" label="Forme"></v-text-field>
          <v-text-field v-model="nouveauMed.qte" type="number" label="Quantité"></v-text-field>
          <v-file-input label="Photo" @change="handleFileUpload"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="dialogAjout = false">Annuler</v-btn>
          <v-btn color="green" @click="ajouter">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- FORMULAIRE DE MODIFICATION -->
    <v-dialog v-model="dialogModif" max-width="500">
      <v-card>
        <v-card-title>Modifier un Médicament</v-card-title>
        <v-card-text>
          <v-text-field v-model="medicamentSelectionne.denomination" label="Nom"></v-text-field>
          <v-text-field v-model="medicamentSelectionne.formepharmaceutique" label="Forme"></v-text-field>
          <v-text-field v-model="medicamentSelectionne.qte" type="number" label="Quantité"></v-text-field>
          <v-file-input label="Photo" @change="handleFileUpload"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="dialogModif = false">Annuler</v-btn>
          <v-btn color="green" @click="modifier">Modifier</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getMedicaments, ajouterMedicament, supprimerMedicament, modifierQuantite, modifierMedicament } from '/project/workspace/src/API/Api.js';

export default {
  setup() {
    const medicaments = ref([]);
    const search = ref("");
    const dialogAjout = ref(false);
    const dialogModif = ref(false);
    const nouveauMed = ref({ denomination: "", formepharmaceutique: "", qte: 1, photo: "" });
    const medicamentSelectionne = ref({});

    const chargerMedicaments = () => {
      getMedicaments((data) => {
        medicaments.value = data;
      }, search.value);
    };

    const ajouter = () => {
      ajouterMedicament(nouveauMed.value, chargerMedicaments);
      dialogAjout.value = false;
      nouveauMed.value = { denomination: "", formepharmaceutique: "", qte: 1, photo: "" };
    };

    const supprimer = (id) => {
      supprimerMedicament(id, chargerMedicaments);
    };

    const ouvrirModification = (med) => {
      medicamentSelectionne.value = { ...med };
      dialogModif.value = true;
    };

    const modifier = () => {
      modifierMedicament(medicamentSelectionne.value, chargerMedicaments);
      dialogModif.value = false;
    };

    onMounted(chargerMedicaments);

    return { medicaments, search, chargerMedicaments, ajouter, supprimer, ouvrirModification, modifier, dialogAjout, dialogModif, nouveauMed, medicamentSelectionne };
  },
};
</script>
