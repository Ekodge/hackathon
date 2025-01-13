<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"> <br>

    <!-- Champ de recherche avec liste des résultats -->
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        type="text"
        placeholder="Rechercher une entreprise" 
        class="search-input"
        @focus="showResults = true" 
        @blur="hideResults"
      />
      <!-- Liste déroulante des résultats -->
      <ul v-if="searchResults.length > 0 && showResults" class="results-dropdown">
        <li 
          v-for="result in searchResults" 
          :key="result.id" 
          @mousedown.prevent="selectResult(result)" 
          class="result-item"
        >
          {{ result.name }}
        </li>
      </ul>
    </div>

    <Favorite msg="Welcome to Your Fav App"/>
    <Discover msg="Welcome to Discovery"/>
    <OwnShop msg="Welcome to your Shop"/>
  </div>
</template>

<script>
import Discover from '@/components/discover.vue';
import Favorite from '@/components/favorite.vue';
import OwnShop from '@/components/ownShop.vue';
// import { login } from '../../baas/src/services/auth';


export default {
  name: 'HomeView',
  components: {
    Favorite,
    Discover,
    OwnShop
  },
  data() {
    return {
      searchQuery: "", // Texte saisi par l'utilisateur
      searchResults: [], // Résultats de recherche
      showResults: false, // Afficher ou non la liste déroulante
    };
  },
  watch: {
    searchQuery: {
      handler(newQuery) {
        if (newQuery.trim() !== "") {
          this.searchShops(newQuery);
        } else {
          this.searchResults = []; // Réinitialise les résultats si le champ est vide
        }
      },
      immediate: true, // Pour appliquer la logique dès le chargement
    },
  },
  methods: {
    async searchShops(query) {
      try {
        const response = await fetch(`http://localhost:3000/api/shop/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des données");
        const results = await response.json();
        this.searchResults = results.length > 0 ? results : []; // Réinitialise si aucune donnée
      } catch (error) {
        console.error("Erreur dans searchShops:", error);
        this.searchResults = []; // Vide les résultats en cas d'erreur
      }
    },
    selectResult(result) {
      this.searchQuery = result.name; // Met à jour l'input avec le nom sélectionné
      this.showResults = false; // Ferme la liste déroulante
      this.$router.push(`/shop/${result.id}`); // Redirige vers la page de l'entreprise
    },
    hideResults() {
      // Utilise un délai pour que le clic sur un élément soit pris en compte avant de cacher les résultats
      setTimeout(() => {
        this.showResults = false;
      }, 100);
    },
  },
};
</script>

<style scoped>
.search-container {
  margin: 20px 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.search-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.result-item {
  padding: 10px;
  cursor: pointer;
}

.result-item:hover {
  background-color: #f0f0f0;
}

img{
  height: 180px;
}

</style>
