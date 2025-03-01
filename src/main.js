import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Importez les styles de Vuetify
import "vuetify/styles";

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(vuetify).mount("#app");
