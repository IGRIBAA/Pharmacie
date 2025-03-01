<template>
  <v-dialog
    :value="dialogAjout"
    @input="$emit('update:dialogAjout', $event)"
    max-width="500"
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl pa-4" elevation="12">
      <v-card-title class="text-h5 font-weight-bold text-primary"
        >➕ Ajouter un Médicament</v-card-title
      >
      <v-card-text>
        <v-text-field
          v-model="nouveauMed.denomination"
          label="Nom du médicament"
          prepend-inner-icon="mdi-pill"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="nouveauMed.formepharmaceutique"
          label="Forme pharmaceutique"
          prepend-inner-icon="mdi-flask"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="nouveauMed.qte"
          type="number"
          label="Quantité"
          prepend-inner-icon="mdi-format-list-numbered"
          outlined
        ></v-text-field>
        <v-file-input
          label="Photo du médicament"
          prepend-icon="mdi-camera"
          @change="handleFileUpload"
          outlined
        ></v-file-input>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="grey" variant="outlined" @click="fermerDialog"
          >Annuler</v-btn
        >
        <v-btn color="primary" elevation="2" @click="ajouter">Ajouter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import { ajouterMedicament } from "../API/Api.js";

export default {
  props: {
    dialogAjout: Boolean,
  },
  emits: ["update:dialogAjout", "ajouter"],
  setup(props, { emit }) {
    const nouveauMed = ref({
      denomination: "",
      formepharmaceutique: "",
      qte: 1,
      photo: "",
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => (nouveauMed.value.photo = reader.result);
      reader.readAsDataURL(file);
    };

    const ajouter = async () => {
      await ajouterMedicament(nouveauMed.value);
      emit("ajouter");
      fermerDialog();
      nouveauMed.value = {
        denomination: "",
        formepharmaceutique: "",
        qte: 1,
        photo: "",
      };
    };

    const fermerDialog = () => {
      emit("update:dialogAjout", false);
    };

    return { nouveauMed, handleFileUpload, ajouter, fermerDialog };
  },
};
</script>
