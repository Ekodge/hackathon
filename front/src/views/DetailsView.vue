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

      <!-- Bouton pour ajouter/retirer des favoris -->
      <button 
        @click="toggleFavorite" 
        :class="{'favorite-btn': !isFavorite, 'unfavorite-btn': isFavorite}">
        {{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
      </button>
      <p :class="{'favorite-msg': isFavorite, 'unfavorite-msg': !isFavorite}">
        {{ isFavorite ? 'Magasin ajouté aux favoris.' : 'Magasin retiré des favoris.' }}
      </p>
    </div>

    <!-- Message d'erreur si la récupération échoue -->
    <p v-else-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <!-- Message de chargement (uniquement si aucune erreur ou données) -->
    <p v-else>Chargement des informations...</p>

    <!-- Affichage des items à vendre -->
    <div v-if="shop && shop.items && shop.items.length > 0">
      <h3>Items à vendre</h3>
      <table>
        <!-- En-tête du tableau -->
        <thead class="item-header">
          <tr>
            <th>Nom</th>
            <th>Prix (€)</th>
            <th>Quantité</th>
            <th>Image</th>
            <th>Date de fin d'offre</th>
            <th>Quantité</th>
            <th>Action</th>
          </tr>
        </thead>

        <!-- Corps du tableau -->
        <tbody>
          <tr v-for="(item, index) in shop.items" :key="index" class="item-row">
            <td>{{ item.name }}</td>
            <td>{{ item.price }} €</td>
            <td>{{ item.quantity }}</td>
            <td>
              <img 
                v-if="item.image" 
                :src="item.image" 
                alt="Image de l'item" 
                class="item-image" 
              />
              <img 
                v-else 
                src="path/to/default-image.jpg" 
                alt="Image par défaut" 
                class="item-image" 
              />
            </td>
            <td>{{ item.endDate }}</td>
            
            <!-- Input pour la quantité à ajouter au panier -->
            <td>
              <input
                v-model.number="item.addToCartQuantity"
                type="number"
                :max="item.quantity"
                min="1"
                placeholder="Quantité"
                class="quantity-input"
              />
            </td>
            <td>
              <button @click="addToCart(item)" class="add-to-cart-btn">Ajouter au panier</button>
            </td>
          </tr>
        </tbody>
      </table>
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
      <button @click="validateCart" class="validate-cart-btn">Valider le panier</button>
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
      isFavorite: false,
      isUserShop: false,
    };
  },
  mounted() {
    this.fetchShopDetails(); // Récupère les détails de l'entreprise
    this.fetchCart(); // Récupère les items du panier pour l'utilisateur
  },
  methods: {
    isUserShopFunction() {
      if (this.shop && this.userId) {
        this.isUserShop = this.shop.idUser == this.userId;
      }
    },
    editShop() {
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
          this.isUserShopFunction();

          // Vérifie si le shop est dans les favoris de l'utilisateur
          fetch(`http://localhost:3000/api/favorite/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: this.userId,
              shopId: this.shop.id,
            }),
          })
            .then((response) => response.json())
            .then((result) => {
              this.isFavorite = result.isFavorite;
            })
            .catch((error) => {
              console.error("Erreur lors de la vérification des favoris :", error);
            });
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    toggleFavorite() {
      const url = this.isFavorite
        ? `http://localhost:3000/api/shop/unfollow`
        : `http://localhost:3000/api/shop/follow`;

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: this.userId,
          shopId: this.shop.id,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors de la mise à jour des favoris.");
          return response.json();
        })
        .then(() => {
          this.isFavorite = !this.isFavorite;
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour des favoris :", error);
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
    copyLink() {
      // Récupère l'URL complète du shop en utilisant l'ID de l'entreprise
      const linkToCopy = `${window.location.origin}/shop/${this.shop.id}`;
      
      // Utilise l'API Clipboard pour copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(linkToCopy).then(() => {
        this.copySuccess = true; // Afficher le message de succès
        setTimeout(() => {
          this.copySuccess = false; // Masquer le message après 2 secondes
        }, 2000);
      }).catch((err) => {
        console.error('Erreur lors de la copie :', err);
        this.copySuccess = false; // Si une erreur se produit, ne pas afficher le message
      });
    },
  },
};
</script>



<style scoped>

/* .item-image {
  max-width: 60px;
  max-height: 60px;
  border-radius: 5px;
  object-fit: cover;
} */

.quantity-input {
  width: 70px;
  /* padding: 5px; */
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-to-cart-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
}

.add-to-cart-btn:hover {
  background-color: #45a049;
}

.action {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Appliquer un layout fixe pour que les colonnes aient toutes la même largeur */
table {
  width: 100%;
  table-layout: fixed;
}

.item-header th, .item-row td {
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  word-wrap: break-word; /* Assurez-vous que le texte long ne dépasse pas la cellule */
}

.item-header th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.item-header th:nth-child(1),
.item-row td:nth-child(1) {
  width: 15%;
}

.item-header th:nth-child(2),
.item-row td:nth-child(2) {
  width: 10%;
}

.item-header th:nth-child(3),
.item-row td:nth-child(3) {
  width: 10%;
}

.item-header th:nth-child(4),
.item-row td:nth-child(4) {
  width: 10%;
}

.item-header th:nth-child(5),
.item-row td:nth-child(5) {
  width: 15%;
}

.item-header th:nth-child(6),
.item-row td:nth-child(6) {
  width: 15%;
}

.item-header th:nth-child(7),
.item-row td:nth-child(7) {
  width: 25%;
}

</style>
