<template>
  <div>
    <h1>Détails de l'entreprise</h1>

    <!-- Affichage des données de l'entreprise -->
    <div v-if="shop">
      <p><strong>ID :</strong> {{ shop.id }}</p>
      <p><strong>Nom :</strong> {{ shop.name }}</p>
      <p><strong>Description :</strong> {{ shop.description }}</p>
      <p><strong>Adresse :</strong> {{ shop.address }}</p>
      <p><strong>Téléphone :</strong> {{ shop.phone }}</p>

      <!-- Bouton pour copier le lien -->
      <button @click="copyLink" class="copy-btn">Copier le lien</button>
      <p v-if="copySuccess" class="success-msg">Lien copié dans le presse-papiers !</p>
    </div>

    <!-- Message d'erreur si la récupération échoue -->
    <p v-else-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <!-- Message de chargement (uniquement si aucune erreur ou données) -->
    <p v-else>Chargement des informations...</p>
  </div>
</template>

<script>
export default {
  name: "DetailsView",
  data() {
    return {
      shop: null, // Les données de l'entreprise
      copySuccess: false, // Pour afficher le message de succès
      errorMessage: null, // Message d'erreur en cas de problème
    };
  },
  mounted() {
    this.fetchShopDetails(); // Appelle la méthode pour récupérer les détails de l'entreprise
  },
  methods: {
    fetchShopDetails() {
      const shopId = this.$route.params.id; // Récupère l'ID depuis l'URL
      fetch(`http://localhost:3000/api/shop/${shopId}`) // Remplacez l'URL par celle de votre API
        .then((response) => {
          if (!response.ok) {
            throw new Error("Aucune entreprise trouvée avec cet ID.");
          }
          return response.json();
        })
        .then((data) => {
          this.shop = data; // Met à jour les données de l'entreprise
        })
        .catch((error) => {
          this.errorMessage = error.message; // Affiche le message d'erreur
        });
    },
    copyLink() {
      const url = window.location.href; // Obtient l'URL actuelle
      navigator.clipboard
        .writeText(url) // Copie l'URL dans le presse-papiers
        .then(() => {
          this.copySuccess = true; // Affiche le message de succès
          setTimeout(() => {
            this.copySuccess = false; // Masque le message après 2 secondes
          }, 2000);
        })
        .catch(() => {
          alert("Échec de la copie du lien. Veuillez réessayer."); // Gestion des erreurs
        });
    },
  },
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

.error-msg {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}
</style>
