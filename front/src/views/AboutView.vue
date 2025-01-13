<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="logout" class="logout-button">Déconnexion</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // Supprimer le statut d'authentification
      localStorage.removeItem('authenticated');
      // Rediriger vers la page de connexion
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.logout-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.logout-button:hover {
  background-color: #d32f2f;
}
</style>
