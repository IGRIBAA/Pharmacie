<template>
  <v-dialog
    :modelValue="dialog"
    @update:modelValue="$emit('update:dialog', $event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="medicament.denomination"
          label="Nom du médicament"
          required
        ></v-text-field>
        <v-text-field
          v-model="medicament.formepharmaceutique"
          label="Forme pharmaceutique"
          required
        ></v-text-field>
        <v-text-field
          v-model="medicament.qte"
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
        <v-btn color="grey" @click="$emit('update:dialog', false)"
          >❌ Annuler</v-btn
        >
        <v-btn color="green" @click="save">✅ {{ action }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    medicament: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleFileUpload(event) {
      this.$emit("handleFileUpload", event);
    },
    save() {
      this.$emit("save");
    },
  },
};
</script>
