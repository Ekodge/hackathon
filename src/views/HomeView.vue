<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"> <br>

    <!-- Champ de recherche pour accéder directement à une entreprise -->
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Entrez l'ID ou le nom de l'entreprise" 
        class="search-input" 
      />
      <button @click="goToCompany" class="search-btn">Aller à l'entreprise</button>
    </div>

    <Favorite msg="Welcome to Your Fav App"/>
    <Discover msg="Welcome to Discovery"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Discover from '@/components/discover.vue'
import Favorite from '@/components/favorite.vue';

export default {
  name: 'HomeView',
  components: {
    Favorite,
    Discover
  },
  data() {
    return {
      searchQuery: "" // Variable pour stocker la saisie de l'utilisateur
    };
  },
  methods: {
    goToCompany() {
      // Vérifie que la saisie de l'utilisateur n'est pas vide
      if (this.searchQuery.trim() === "") {
        alert("Veuillez entrer un ID ou un nom valide.");
        return;
      }

      // Redirection vers la page correspondante (avec l'ID ou le nom)
      this.$router.push(`/${this.searchQuery}`);
    }
  }
};
</script>

<style scoped>
.search-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  flex-grow: 1;
  font-size: 16px;
}

.search-btn {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #36996c;
}
</style>
