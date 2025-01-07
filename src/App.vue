<template>
   <nav v-if="showNavigation">
      <router-link to="/">Accueil</router-link> |
      <router-link to="/about">À propos</router-link> |
      <router-link to="/map">Carte</router-link>
    </nav>
    <router-view />
</template>

<script>
export default {
  computed: {
    showNavigation() {
      // Vérifie si la route actuelle est différente de '/login'
      return this.$route.path !== '/login';
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
