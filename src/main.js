import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#BDB395", // Couleur principale
          secondary: "#424242", // Couleur secondaire
          accent: "#82B1FF", // Couleur d'accentuation
          error: "#FF5252", // Couleur d'erreur
          info: "#2196F3", // Couleur d'information
          success: "#4CAF50", // Couleur de succès
          warning: "#FFC107", // Couleur d'avertissement
        },
      },
    },
  },
});

createApp(App).use(vuetify).mount("#app");
