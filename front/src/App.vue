<template>
  <nav v-if="showNavigation">
    <router-link to="/" class="no-link">ACCUEIL</router-link>
    <router-link to="/about" class="no-link">À PROPOS</router-link>
    <router-link to="/map" class="no-link">CARTE</router-link>
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
  padding-top: 20px;
  padding-bottom: 40px;
}

nav a {
  padding: 6pt;
  margin: 8px;
  font-weight: bold;
  color: #2c3e50;
}

nav a:hover {
  text-decoration: underline 2pt #2c3e50;
}

nav a.router-link-exact-active {
  background-color: #2c3e50;
  color: #ffffff;
  border-radius: 5px;
}

nav a.router-link-exact-active:hover {
  text-decoration: none;
}

.no-link {
  text-decoration: none;
}
</style>
