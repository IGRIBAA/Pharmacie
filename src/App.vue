<template>
  <v-app>
    <AppBar />
    <HomeView />
    <Footer />
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar.vue";
import HomeView from "./views/HomeView.vue";
import Footer from "./components/Footer.vue";

export default {
  components: {
    AppBar,
    HomeView,
    Footer,
  },
};
</script>
