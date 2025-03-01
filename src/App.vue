<template>
  <v-container>
    <h1>💊 Pharmacie</h1>

    <!-- 🔍 Barre de recherche -->
    <div class="search-container">
      <v-text-field
        v-model="search"
        label="🔍 Rechercher un médicament..."
        clearable
        @input="chargerMedicaments"
        class="mb-4"
      />
    </div>

    <!-- 📋 Tableau des médicaments -->
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
          <td><strong>{{ med.qte }}</strong> unités</td>
          <td>
            <img :src="`https://apipharmacie.pecatte.fr/images/${med.photo}`" width="50" />
          </td>
          <td class="action-buttons">
            <v-btn class="v-btn--danger" @click="supprimer(med.id)">❌ Supprimer</v-btn>
            <v-btn class="v-btn--success" @click="ajouterQte(med.id, med.qte)">➕ Ajouter 1</v-btn>
            <v-btn class="v-btn--warning" @click="diminuerQte(med.id, med.qte)">➖ Retirer 1</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- 🚀 Bouton Ajouter un Médicament -->
    <div class="add-btn">
      <v-btn color="primary" @click="ouvrirFormulaireAjout">➕ Ajouter un médicament</v-btn>
    </div>

    <!-- 📌 MODAL FORMULAIRE D'AJOUT -->
    <v-dialog v-model="dialogAjout" max-width="500px">
      <v-card>
        <v-card-title>🆕 Ajouter un Médicament</v-card-title>
        <v-card-text>
          <v-text-field v-model="nouveauMed.denomination" label="Nom du médicament" required></v-text-field>
          <v-text-field v-model="nouveauMed.formepharmaceutique" label="Forme pharmaceutique" required></v-text-field>
          <v-text-field v-model="nouveauMed.qte" type="number" label="Quantité" required></v-text-field>
          <v-file-input label="Photo (Facultatif)" @change="handleFileUpload"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="dialogAjout = false">❌ Annuler</v-btn>
          <v-btn color="green" @click="ajouter">✅ Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getMedicaments, ajouterMedicament, supprimerMedicament, modifierQuantite } from '/project/workspace/src/API/Api.js';

export default {
  setup() {
    const medicaments = ref([]);
    const search = ref("");
    const dialogAjout = ref(false);
    const nouveauMed = ref({ denomination: "", formepharmaceutique: "", qte: 1, photo: "" });

    // Charger les médicaments dès le montage du composant
    const chargerMedicaments = () => {
      console.log("📥 Chargement des médicaments...");
      getMedicaments((data) => {
        console.log("✅ Médicaments reçus :", data);
        medicaments.value = data;
      }, search.value);
    };

    // ✅ Ouvrir correctement le formulaire d'ajout
    const ouvrirFormulaireAjout = () => {
      console.log("📌 Ouverture du formulaire d'ajout"); // Debug
      nouveauMed.value = { denomination: "", formepharmaceutique: "", qte: 1, photo: "" }; // Réinitialiser les champs
      dialogAjout.value = true; // ✅ Assurer que le formulaire s'affiche bien
    };

    // ✅ Ajouter un médicament
    const ajouter = () => {
      // Vérifications des champs obligatoires
      if (!nouveauMed.value.denomination.trim()) {
        alert("❌ Le champ 'Nom du médicament' est obligatoire !");
        return;
      }
      if (!nouveauMed.value.formepharmaceutique.trim()) {
        alert("❌ Le champ 'Forme pharmaceutique' est obligatoire !");
        return;
      }
      if (!nouveauMed.value.qte || isNaN(nouveauMed.value.qte) || parseInt(nouveauMed.value.qte) <= 0) {
        alert("❌ La quantité doit être un nombre positif !");
        return;
      }

      console.log("✅ Ajout du médicament en cours...", nouveauMed.value);

      ajouterMedicament(nouveauMed.value, () => {
        chargerMedicaments(); // Rafraîchir la liste après ajout
        dialogAjout.value = false; // Fermer le formulaire après ajout
      });
    };

    // ✅ Gestion du téléchargement de l'image
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        nouveauMed.value.photo = reader.result;
      };
      reader.readAsDataURL(file);
    };

    // ✅ Supprimer un médicament
    const supprimer = (id) => {
      supprimerMedicament(id, chargerMedicaments);
    };

    // ✅ Modifier la quantité (+1 ou -1)
    const ajouterQte = (id, qteActuelle) => {
      const nouvelleQuantite = qteActuelle + 1;
      modifierQuantite(id, nouvelleQuantite, chargerMedicaments);
    };

    const diminuerQte = (id, qteActuelle) => {
      if (qteActuelle > 0) {
        const nouvelleQuantite = qteActuelle - 1;
        modifierQuantite(id, nouvelleQuantite, chargerMedicaments);
      }
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
      dialogAjout, 
      nouveauMed, 
      handleFileUpload, 
      ouvrirFormulaireAjout
    };
  }
};
</script>
