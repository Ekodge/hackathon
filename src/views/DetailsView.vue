<template>
  <div>
    <h1>Détails de l'entreprise</h1>
    <p><strong>ID :</strong> {{ $route.params.id }}</p>
    <p><strong>Nom :</strong> {{ $route.params.name }}</p>

    <!-- Bouton pour copier le lien -->
    <button @click="copyLink" class="copy-btn">Copier le lien</button>

    <!-- Message de confirmation -->
    <p v-if="copySuccess" class="success-msg">Lien copié dans le presse-papiers !</p>
  </div>
</template>

<script>
export default {
  name: "DetailsView",
  data() {
    return {
      copySuccess: false // Pour afficher le message de succès
    };
  },
  methods: {
    copyLink() {
      const url = window.location.href; // Obtient l'URL actuelle
      navigator.clipboard.writeText(url) // Copie l'URL dans le presse-papiers
        .then(() => {
          this.copySuccess = true; // Affiche le message de succès
          setTimeout(() => {
            this.copySuccess = false; // Masque le message après 2 secondes
          }, 2000);
        })
        .catch(() => {
          alert("Échec de la copie du lien. Veuillez réessayer."); // Gestion des erreurs
        });
    }
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

.copy-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.copy-btn:hover {
  background-color: #36996c;
}

.success-msg {
  color: #42b983;
  margin-top: 10px;
  font-size: 14px;
}
</style>
