import "./assets/base.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "./assets/base.css";

const vuetify = createVuetify();
createApp(App).use(vuetify).mount("#app");
