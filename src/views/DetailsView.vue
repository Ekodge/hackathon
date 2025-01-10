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
        <span class="text-image">Image</span>
        <span>Date de fin d'offre</span>
        <span class="text-quantity">quantité</span>
        <span>Action</span>
      </div>

      <!-- Affichage des items avec le bouton d'ajout au panier -->
      <div v-for="(item, index) in shop.items" :key="index" class="item-row">
        <span>{{ item.name }}</span>
        <span class="price">{{ item.price }} €</span>
        <span class="quantity">{{ item.quantity }}</span>
        <div v-if="item.image">
          <img :src="item.image" alt="Image de l'item" class="item-image" />
        </div>
        <span>{{ item.endDate }}</span>
        
        <!-- Input pour la quantité à ajouter au panier -->
        <input
          v-model.number="item.addToCartQuantity"
          type="number"
          :max="item.quantity"
          min="1"
          placeholder="Quantité"
          class="quantity-input"
        />
        <button @click="addToCart(item)" class="add-to-cart-btn">Ajouter au panier</button>
      </div>
    </div>

    <!-- Message si aucun item n'est trouvé -->
    <p v-else-if="shop && shop.items && shop.items.length === 0">
      Aucun item à vendre pour cette entreprise.
    </p>

    <!-- Affichage du panier -->
    <div v-if="cart.length > 0">
      <h3>Votre Panier</h3>
      <ul>
        <li v-for="(cartItem, index) in cart" :key="index">
          {{ cartItem.name }} - {{ cartItem.quantity }} à {{ cartItem.price }} € chacune
        </li>
      </ul>
    </div>
  </div>
  <!-- Bouton pour modifier le shop si c'est le shop du user -->
  <div v-if="isUserShop">
    <button @click="editShop" class="edit-shop-btn">Modifier ce shop</button>
  </div>
</template>

<script>
export default {
  name: "DetailsView",
  data() {
    return {
      shop: null,
      copySuccess: false,
      errorMessage: null,
      cart: [], // Panier vide au départ
    };
  },
  mounted() {
    this.fetchShopDetails(); // Appelle la méthode pour récupérer les détails de l'entreprise
  },
  computed: {
    isUserShop() {
      // Vérifie si le shop appartient à l'utilisateur connecté
      const userId = localStorage.getItem("userId");
      return this.shop && this.shop.owner == userId;
    },
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
          console.log(this.shop);
        })
        .catch((error) => {
          this.errorMessage = error.message; // Affiche le message d'erreur
        });
    },

    copyLink() {
      const url = window.location.href;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          this.copySuccess = true;
          setTimeout(() => {
            this.copySuccess = false;
          }, 2000);
        })
        .catch(() => {
          alert("Échec de la copie du lien. Veuillez réessayer.");
        });
    },

    // Ajouter l'item au panier
    addToCart(item) {
      if (item.addToCartQuantity <= 0 || item.addToCartQuantity > item.quantity) {
        alert("Veuillez entrer une quantité valide !");
        return;
      }

      // Vérifier si l'item est déjà dans le panier
      const cartItem = this.cart.find((cartItem) => cartItem.id === item.id);
      if (cartItem) {
        cartItem.quantity += item.addToCartQuantity; // Si l'item est déjà dans le panier, on met à jour la quantité
      } else {
        this.cart.push({ ...item, quantity: item.addToCartQuantity }); // Sinon on l'ajoute
      }

      // Mettre à jour la quantité restante dans le shop
      item.quantity -= item.addToCartQuantity;

      // Réinitialiser la quantité d'ajout pour cet item
      item.addToCartQuantity = 1;
    },
    
    editShop() {
      this.$router.push({ name: "EditShop", params: { shopId: this.shop.id } });
    },
  },
};
</script>

<style scoped>
.item-header {
  display: flex;
  gap: 10px;
  font-weight: bold;
  margin-bottom: 10px;
  align-items: center; /* Assurer un alignement vertical cohérent */
}

.item-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center; /* Alignement vertical des éléments */
}

.item-header span,
.item-row span{
  flex: 1;
  text-align: left;
  padding: 0 8px;
}

.item-row button {
  flex: 1;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  padding: 0 8px;
}

.text-image {
  max-width: 50px;
}

.quantity-input {
  flex: 1;
  text-align: left;
  margin: 0 8px;
  max-width: 60px; /* Spécifier une largeur pour le champ quantité */
}

.text-quantity {
  max-width: 60px;
}

.add-to-cart-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
}

.add-to-cart-btn:hover {
  background-color: #36996c;
}


</style>
