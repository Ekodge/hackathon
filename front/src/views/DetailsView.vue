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

      <!-- Bouton pour valider le panier -->
      <div v-if="cart.length > 0">
  <h3>Votre Panier</h3>
  <ul>
    <li v-for="(cartItem, index) in cart" :key="index">
      {{ cartItem.name }} - 
      <input
        type="number"
        v-model.number="cartItem.quantity"
        min="1"
        @change="updateCartQuantity(cartItem.id, cartItem.quantity)"
      />
      à {{ cartItem.price }} € chacune
      <button @click="deleteCartItem(cartItem.id)" class="delete-cart-btn">
        Supprimer
      </button>
    </li>
  </ul>

  <!-- Bouton pour valider le panier -->
  <button @click="validateCart" class="validate-cart-btn">Valider le panier</button>
</div>

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
      cart: [], // Panier local initialisé à vide
      userId: localStorage.getItem("userId"), // Récupérer l'ID de l'utilisateur connecté
    };
  },
  mounted() {
    this.fetchShopDetails(); // Récupère les détails de l'entreprise
    this.fetchCart(); // Récupère les items du panier pour l'utilisateur
  },
  methods: {
    isUserShop() {
      this.shop && this.shop.idUser == this.userId;
    },
    editShop() {
      this.shop.items = [];
      localStorage.setItem("shopData", JSON.stringify(this.shop)); // Stockez les données dans localStorage
      this.$router.push({ name: "EditShop" }); // Naviguez vers la page d'édition
    },
    fetchShopDetails() {
      const shopId = this.$route.params.id; // Récupère l'ID du shop depuis l'URL
      fetch(`http://localhost:3000/api/shop/${shopId}`) // Appel à l'API pour les détails du shop
        .then((response) => {
          if (!response.ok) throw new Error("Aucune entreprise trouvée avec cet ID.");
          return response.json();
        })
        .then((data) => {
          this.shop = data;
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    fetchCart() {
      // Récupérer les items du panier pour l'utilisateur connecté
      fetch(`http://localhost:3000/api/cart/${this.userId}`)
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors de la récupération du panier.");
          return response.json();
        })
        .then((data) => {
          this.cart = data.map((cartItem) => ({
            id: cartItem.id,
            name: cartItem.itemName, // Nom de l'article (si disponible dans la réponse)
            price: cartItem.itemPrice, // Prix de l'article (si disponible dans la réponse)
            quantity: cartItem.quantity,
            itemId: cartItem.itemId,
          }));
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du panier :", error);
        });
    },
    addToCart(item) {
      const quantity = item.addToCartQuantity;
      if (quantity <= 0 || quantity > item.quantity) {
        alert("Veuillez entrer une quantité valide !");
        return;
      }

      // Envoyer la requête pour ajouter un article au panier
      fetch(`http://localhost:3000/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: this.userId,
          itemId: item.id,
          quantity,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors de l'ajout au panier.");
          return response.json();
        })
        .then(() => {
          alert("Article ajouté au panier avec succès !");
          this.fetchCart(); // Rafraîchir le panier local
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout au panier :", error);
        });
    },
    updateCartQuantity(cartItemId, newQuantity) {
      // Mettre à jour la quantité d'un article dans le panier
      fetch(`http://localhost:3000/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors de la mise à jour du panier.");
          return response.json();
        })
        .then(() => {
          this.fetchCart(); // Rafraîchir le panier local
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour du panier :", error);
        });
    },
    deleteCartItem(cartItemId) {
      // Supprimer un article du panier
      fetch(`http://localhost:3000/api/cart/${cartItemId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors de la suppression de l'article.");
          return response.json();
        })
        .then(() => {
          this.fetchCart(); // Rafraîchir le panier local
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de l'article :", error);
        });
    },
    validateCart() {
      // Simuler une validation du panier
      alert("Votre panier a été validé !");
      this.cart = []; // Réinitialiser le panier local
    },
  },
};
</script>



<style scoped>
.validate-cart-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 15px;
  margin-top: 10px;
}

.validate-cart-btn:hover {
  background-color: #36996c;
}

.delete-cart-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: 10px;
}

.delete-cart-btn:hover {
  background-color: #c0392b;
}

.validate-cart-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 15px;
  margin-top: 10px;
}

.validate-cart-btn:hover {
  background-color: #36996c;
}
</style>
