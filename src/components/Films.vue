<script setup>
import { ref } from 'vue'
import AffichListFilms from './AffichListFilms.vue'
import FormTexte from './FormTexte.vue'
const motcle =ref('');
function handlerRecherche(texte) {
    motcle.value = texte;
}
</script>
<template>
    <FormTexte @eventSubmit="handlerRecherche"></FormTexte>
    <AffichListFilms :critere="motcle"/>
</template>