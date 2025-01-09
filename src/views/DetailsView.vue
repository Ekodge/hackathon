<template>
  <div>
    <h1>Détails de l'entreprise</h1>

    <!-- Affichage des données de l'entreprise si shop est chargé -->
    <div v-if="shop">
      <p><strong>ID :</strong> {{ shop.id }}</p>
      <p><strong>Nom :</strong> {{ shop.name }}</p>
      <p><strong>Description :</strong> {{ shop.description }}</p>
      <p><strong>Adresse :</strong> {{ shop.address }}</p>
      <p><strong>Téléphone :</strong> {{ shop.phone }}</p>
      <p><strong>Distance :</strong> {{ shop.dist }} km</p>

      <!-- Affichage de l'image du shop -->
      <div v-if="shop.image">
        <img :src="shop.image" alt="Image du shop" class="shop-image" />
      </div>

      <!-- Bouton pour copier le lien -->
      <button @click="copyLink" class="copy-btn">Copier le lien</button>
      <p v-if="copySuccess" class="success-msg">Lien copié dans le presse-papiers !</p>
    </div>

    <!-- Message d'erreur si la récupération échoue -->
    <p v-else-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <!-- Message de chargement (uniquement si aucune erreur ou données) -->
    <p v-else>Chargement des informations...</p>

    <!-- Affichage des items à vendre -->
    <div v-if="shop && shop.items && shop.items.length > 0">
      <h3>Items à vendre</h3>
      <div class="item-header">
        <span>Nom</span>
        <span class="price">Prix (€)</span>
        <span class="quantity">Quantité</span>
        <span>Image</span>
        <span>Date de fin d'offre</span>
      </div>
      <div v-for="(item, index) in shop.items" :key="index" class="item-row">
        <span>{{ item.name }}</span>
        <span class="price">{{ item.price }} €</span>
        <span class="quantity">{{ item.quantity }}</span>
        <div v-if="item.image">
          <img :src="item.image" alt="Image de l'item" class="item-image" />
        </div>
        <span>{{ item.endDate }}</span>
      </div>
    </div>

    <!-- Message si aucun item n'est trouvé -->
    <p v-else-if="shop && shop.items && shop.items.length === 0">
      Aucun item à vendre pour cette entreprise.
    </p>
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

.shop-image {
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
  border-radius: 8px;
}

.item-header {
  display: flex;
  gap: 10px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  padding: 0 10px;
}

.item-header span {
  flex: 1;
  text-align: left;
  padding: 0 8px;
}

.item-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 0 10px;
}

.item-row span {
  flex: 1;
  padding: 8px;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}

.price, .quantity {
  flex: 0.5;
}
</style>
