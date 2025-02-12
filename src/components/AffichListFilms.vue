<script setup>
import { reactive, watch } from 'vue'
import { Film } from '../Film.js'

const props = defineProps(["critere"])

const apiKey = "af1e1c8f8ad6efb5b326eabaffa38b8a";
const url =
      "https://api.themoviedb.org/3/search/movie?api_key=" +
      apiKey +
      "&language=fr-FR&page=1&query=";

const listeFilms = reactive([]);

function getFilms() {
    const fetchOptions = { method: "GET" };
    fetch(url + props.critere, fetchOptions)
    .then((response) => {
    return response.json();
    })
    .then((dataJSON) => {
        console.log(dataJSON);
        const films = dataJSON.results;
        listeFilms.splice(0, listeFilms.length);
        films.forEach((filmjson) => {
            listeFilms.push(new Film(filmjson));
        })
    })
    .catch((error) => {
    console.log(error);
    });
}
watch(props, (newcritere) => {
    console.log(newcritere);
    getFilms();
});

</script>
<template>
    <h2>liste des films</h2>
    <div class="films-container">
        <div v-for="film in listeFilms"
             :key="film.id"
             class="film-item">
            <div>
              <img 
                v-if=" film.affiche != ''"
                class="image"
                :src="'https://image.tmdb.org/t/p/w500/' + film.affiche">
                 {{ film.titre }}
            </div>
        </div>
    </div>
</template>
<style>
.films-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; 
}
.film-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px; 
}
.image {
    width: 100px;
    height: 150px;
}
</style>