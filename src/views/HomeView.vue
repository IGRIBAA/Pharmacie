<template>
  <v-container>
    <h1>💊 Pharmacie</h1>

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
      <v-col>
        <v-select
          v-model="selectedForme"
          :items="formesPharmaceutiques"
          label="Filtrer par forme pharmaceutique"
          clearable
          @update:modelValue="chargerMedicaments"
        />
      </v-col>

      <v-col cols="auto" class="export-btn">
        <v-btn color="success" @click="exporterExcel"
          >📤 Exporter en Excel</v-btn
        >
      </v-col>
    </v-row>

    <MedicamentTable
      :medicaments="medicaments"
      @supprimer="supprimer"
      @ouvrirFormulaireModification="ouvrirFormulaireModification"
      @ajouterQte="ajouterQte"
      @diminuerQte="diminuerQte"
    />

    <Pagination v-model="currentPage" :totalPages="totalPages" />

    <div class="add-btn">
      <v-btn color="info" @click="ouvrirFormulaireAjout"
        >➕ Ajouter un médicament</v-btn
      >
    </div>

    <MedicamentForm
      :dialog="dialogAjout"
      :medicament="nouveauMed"
      title="🆕 Ajouter un Médicament"
      action="Ajouter"
      @handleFileUpload="handleFileUpload"
      @save="ajouter"
      @update:dialog="dialogAjout = $event"
    />

    <MedicamentForm
      :dialog="dialogModification"
      :medicament="medicamentModifie"
      title="✏️ Modifier un Médicament"
      action="Modifier"
      @handleFileUpload="handleFileUploadModification"
      @save="modifier"
      @update:dialog="dialogModification = $event"
    />
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  getMedicaments,
  ajouterMedicament,
  supprimerMedicament,
  modifierMedicament,
  modifierQuantite,
} from "../API/Api.js";
import * as XLSX from "xlsx";
import MedicamentTable from "../components/MedicamentTable.vue";
import MedicamentForm from "../components/MedicamentForm.vue";
import Pagination from "../components/Pagination.vue";

export default {
  components: {
    MedicamentTable,
    MedicamentForm,
    Pagination,
  },
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
    const dialogModification = ref(false);
    const medicamentModifie = ref({
      id: null,
      denomination: "",
      formepharmaceutique: "",
      qte: 1,
      photo: "",
    });

    const chargerMedicaments = () => {
      getMedicaments((data) => {
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

    const ouvrirFormulaireModification = (med) => {
      medicamentModifie.value = { ...med };
      dialogModification.value = true;
    };

    const handleFileUploadModification = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        medicamentModifie.value.photo = reader.result;
      };
      reader.readAsDataURL(file);
    };

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

      modifierMedicament(medicamentModifie.value, () => {
        chargerMedicaments();
        dialogModification.value = false;
      });
    };

    const ouvrirFormulaireAjout = () => {
      nouveauMed.value = {
        denomination: "",
        formepharmaceutique: "",
        qte: 1,
        photo: "",
      };
      dialogAjout.value = true;
    };

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

      ajouterMedicament(nouveauMed.value, () => {
        chargerMedicaments();
        dialogAjout.value = false;
      });
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        nouveauMed.value.photo = reader.result;
      };
      reader.readAsDataURL(file);
    };

    const supprimer = (id) => {
      supprimerMedicament(id, chargerMedicaments);
    };

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

    const exporterExcel = () => {
      const data = medicaments.value.map((med) => ({
        Nom: med.denomination,
        Forme: med.formepharmaceutique,
        Quantité: med.qte,
        Photo: med.photo,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Médicaments");
      XLSX.writeFile(workbook, "medicaments.xlsx");
    };

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

.v-table {
  border-collapse: collapse;
  width: 100%;
}

.v-table th,
.v-table td {
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

.export-btn .v-btn {
  background-color: #8e44ad;
  color: white;
  font-size: 14px;
  height: 45px;
  border-radius: 7px;
  transition: background-color 0.3s ease;
}

.export-btn .v-btn:hover {
  background-color: #9b59b6;
}

.v-btn {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-5px);
  background-color: #2980b9;
}

.add-btn .v-btn {
  font-size: 14px;
  height: 45px;
  border-radius: 7px;
  transition: background-color 0.3s ease;
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
    padding: 1px;
    font-size: 16px;
  }

  .export-btn .v-btn {
    width: 100%;
    padding: 1px;
    font-size: 16px;
  }
}
</style>
