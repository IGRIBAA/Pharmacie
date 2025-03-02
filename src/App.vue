<template>
  <v-app>
    <!-- Barre de navigation -->
    <v-app-bar color="#D5C7A3" dark>
      <v-toolbar-title>💊 Pharmacie</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <!-- Contenu principal -->
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

      <v-row class="mb-4" align="center">
        <!-- Filtre par forme pharmaceutique (prend l'espace disponible) -->
        <v-col>
          <v-select
            v-model="selectedForme"
            :items="formesPharmaceutiques"
            label="Filtrer par forme pharmaceutique"
            clearable
            @update:modelValue="chargerMedicaments"
          />
        </v-col>

        <!-- Bouton d'exportation Excel (aligné à droite) -->
        <v-col cols="auto" class="export-btn">
          <v-btn color="success" @click="exporterExcel"
            >📤 Exporter en Excel</v-btn
          >
        </v-col>
      </v-row>

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
              <v-btn
                class="v-btn--info"
                @click="ouvrirFormulaireModification(med)"
                >✏️ Modifier</v-btn
              >
              <v-btn class="v-btn--success" @click="ajouterQte(med.id, med.qte)"
                >➕ Ajouter 1</v-btn
              >
              <v-btn
                class="v-btn--warning"
                @click="diminuerQte(med.id, med.qte)"
                >➖ Retirer 1</v-btn
              >
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Pagination -->
      <v-pagination
        v-model="currentPage"
        :length="Math.ceil(totalItems / itemsPerPage)"
        @update:modelValue="chargerMedicaments"
        class="mt-4"
      />

      <!-- 🚀 Bouton Ajouter un Médicament -->
      <div class="add-btn">
        <v-btn color="info" @click="ouvrirFormulaireAjout"
          >➕ Ajouter un médicament</v-btn
        >
      </div>

      <!-- 📌 MODAL FORMULAIRE DE MODIFICATION -->
      <v-dialog v-model="dialogModification" max-width="500px">
        <v-card>
          <v-card-title>✏️ Modifier un Médicament</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="medicamentModifie.denomination"
              label="Nom du médicament"
              required
            ></v-text-field>
            <v-text-field
              v-model="medicamentModifie.formepharmaceutique"
              label="Forme pharmaceutique"
              required
            ></v-text-field>
            <v-text-field
              v-model="medicamentModifie.qte"
              type="number"
              label="Quantité"
              required
            ></v-text-field>
            <v-file-input
              label="Photo (Facultatif)"
              @change="handleFileUploadModification"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn color="grey" @click="dialogModification = false"
              >❌ Annuler</v-btn
            >
            <v-btn color="green" @click="modifier">✅ Modifier</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 📌 MODAL FORMULAIRE D'AJOUT -->
      <v-dialog v-model="dialogAjout" max-width="500px">
        <v-card>
          <v-card-title>🆕 Ajouter un Médicament</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="nouveauMed.denomination"
              label="Nom du médicament"
              required
            ></v-text-field>
            <v-text-field
              v-model="nouveauMed.formepharmaceutique"
              label="Forme pharmaceutique"
              required
            ></v-text-field>
            <v-text-field
              v-model="nouveauMed.qte"
              type="number"
              label="Quantité"
              required
            ></v-text-field>
            <v-file-input
              label="Photo (Facultatif)"
              @change="handleFileUpload"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn color="grey" @click="dialogAjout = false">❌ Annuler</v-btn>
            <v-btn color="green" @click="ajouter">✅ Ajouter</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>

    <v-footer color="primary">
      <v-row justify="center" no-gutters>
        <v-col class="text-center mt-4" cols="12">
          <strong>💊 Pharmacie</strong> — Tous droits réservés ©
          {{ new Date().getFullYear() }}
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  getMedicaments,
  ajouterMedicament,
  supprimerMedicament,
  modifierMedicament,
  modifierQuantite,
} from "./API/Api.js";
import * as XLSX from "xlsx";

export default {
  setup() {
    const medicaments = ref([]);
    const search = ref("");
    const selectedForme = ref(null);
    const formesPharmaceutiques = ref([
      "Comprimé",
      "Gélule",
      "Sirop",
      "Injection",
      "Crème",
      "Pommade",
    ]);
    const dialogAjout = ref(false);
    const nouveauMed = ref({
      denomination: "",
      formepharmaceutique: "",
      qte: 1,
      photo: "",
    });
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const totalItems = ref(0);
    const notifications = ref([]);

    const dialogModification = ref(false);
    const medicamentModifie = ref({
      id: null,
      denomination: "",
      formepharmaceutique: "",
      qte: 1,
      photo: "",
    });

    // Charger les médicaments
    const chargerMedicaments = () => {
      console.log("📥 Chargement des médicaments...");
      getMedicaments((data) => {
        console.log("✅ Médicaments reçus :", data);

        if (selectedForme.value) {
          data = data.filter(
            (med) => med.formepharmaceutique === selectedForme.value
          );
        }

        totalItems.value = data.length;

        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        medicaments.value = data.slice(start, end);
      }, search.value);
    };

    // Ouvrir le formulaire de modification
    const ouvrirFormulaireModification = (med) => {
      console.log("📌 Ouverture du formulaire de modification", med);
      medicamentModifie.value = { ...med }; // Copie les données du médicament
      dialogModification.value = true; // Ouvre le modal
    };

    // Gérer l'upload de fichier pour la modification
    const handleFileUploadModification = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        medicamentModifie.value.photo = reader.result;
      };
      reader.readAsDataURL(file);
    };

    // Modifier un médicament
    const modifier = () => {
      if (!medicamentModifie.value.denomination.trim()) {
        alert("❌ Le champ 'Nom du médicament' est obligatoire !");
        return;
      }
      if (!medicamentModifie.value.formepharmaceutique.trim()) {
        alert("❌ Le champ 'Forme pharmaceutique' est obligatoire !");
        return;
      }
      if (
        !medicamentModifie.value.qte ||
        isNaN(medicamentModifie.value.qte) ||
        parseInt(medicamentModifie.value.qte) <= 0
      ) {
        alert("❌ La quantité doit être un nombre positif !");
        return;
      }

      console.log(
        "✅ Modification du médicament en cours...",
        medicamentModifie.value
      );

      // Appeler l'API pour mettre à jour le médicament
      modifierMedicament(medicamentModifie.value, () => {
        chargerMedicaments(); // Recharge la liste des médicaments
        dialogModification.value = false; // Ferme la modal
      });
    };

    // Ouvrir le formulaire d'ajout
    const ouvrirFormulaireAjout = () => {
      console.log("📌 Ouverture du formulaire d'ajout");
      nouveauMed.value = {
        denomination: "",
        formepharmaceutique: "",
        qte: 1,
        photo: "",
      };
      dialogAjout.value = true;
    };

    // Ajouter un médicament
    const ajouter = () => {
      if (!nouveauMed.value.denomination.trim()) {
        alert("❌ Le champ 'Nom du médicament' est obligatoire !");
        return;
      }
      if (!nouveauMed.value.formepharmaceutique.trim()) {
        alert("❌ Le champ 'Forme pharmaceutique' est obligatoire !");
        return;
      }
      if (
        !nouveauMed.value.qte ||
        isNaN(nouveauMed.value.qte) ||
        parseInt(nouveauMed.value.qte) <= 0
      ) {
        alert("❌ La quantité doit être un nombre positif !");
        return;
      }

      console.log("✅ Ajout du médicament en cours...", nouveauMed.value);

      ajouterMedicament(nouveauMed.value, () => {
        chargerMedicaments();
        dialogAjout.value = false;
      });
    };

    // Gérer l'upload de fichier pour l'ajout
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        nouveauMed.value.photo = reader.result;
      };
      reader.readAsDataURL(file);
    };

    // Supprimer un médicament
    const supprimer = (id) => {
      supprimerMedicament(id, chargerMedicaments);
    };

    // Ajouter une quantité
    const ajouterQte = (id, qteActuelle) => {
      const nouvelleQuantite = qteActuelle + 1;
      modifierQuantite(id, nouvelleQuantite, chargerMedicaments);
    };

    // Diminuer une quantité
    const diminuerQte = (id, qteActuelle) => {
      if (qteActuelle > 0) {
        const nouvelleQuantite = qteActuelle - 1;
        modifierQuantite(id, nouvelleQuantite, chargerMedicaments);
      }
    };

    const exporterExcel = () => {
      // Créer un tableau de données à exporter
      const data = medicaments.value.map((med) => ({
        Nom: med.denomination,
        Forme: med.formepharmaceutique,
        Quantité: med.qte,
        Photo: med.photo,
      }));

      // Créer une feuille de calcul à partir des données
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Créer un nouveau classeur et ajouter la feuille de calcul
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Médicaments");

      // Exporter le fichier Excel
      XLSX.writeFile(workbook, "medicaments.xlsx");
    };

    // Charger les médicaments au montage du composant
    onMounted(chargerMedicaments);

    return {
      medicaments,
      search,
      selectedForme,
      formesPharmaceutiques,
      chargerMedicaments,
      ajouter,
      supprimer,
      ajouterQte,
      diminuerQte,
      dialogAjout,
      nouveauMed,
      handleFileUpload,
      ouvrirFormulaireAjout,
      currentPage,
      itemsPerPage,
      totalItems,
      notifications,
      dialogModification,
      medicamentModifie,
      ouvrirFormulaireModification,
      handleFileUploadModification,
      modifier,
      exporterExcel,
    };
  },
};
</script>

<style scoped>
.search-container {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.v-text-field {
  border-radius: 8px;
  padding-left: 16px;
}
v-table {
  border-collapse: collapse;
  width: 100%;
}

v-table th,
v-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #555;
  text-align: center;
}

.action-buttons {
  padding: 8px 12px;
  display: flex;
  gap: 10px;
}

.v-btn--danger {
  background-color: #eaeaea;
  color: red;
}

.v-btn--info {
  background-color: #3498db;
  color: #fff;
}

.v-btn--success {
  background-color: #2ecc71;
  color: #fff;
}

.v-btn--warning {
  background-color: #bdb395;
  color: #fff;
}
.v-dialog {
  background-color: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.v-btn {
  border-radius: 12px;
  padding: 10px 20px;
}

.v-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.v-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.v-pagination .v-btn {
  background-color: #3498db;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
}

.v-pagination .v-btn:hover {
  background-color: #2980b9;
}
.export-btn v-btn {
  background-color: #8e44ad;
  color: white;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 24px;
  transition: background-color 0.3s ease;
}

.export-btn v-btn:hover {
  background-color: #9b59b6;
}
/* Animation pour les boutons */
.v-btn {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-5px);
  background-color: #2980b9;
}
h1,
h2,
h3 {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
}

.v-text-field,
.v-btn {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}

@media screen and (max-width: 600px) {
  .search-container {
    padding: 8px;
  }

  .v-btn {
    width: 100%;
    padding: 16px;
    font-size: 16px;
  }

  .export-btn v-btn {
    width: 100%;
    padding: 16px;
    font-size: 16px;
  }
}
</style>
