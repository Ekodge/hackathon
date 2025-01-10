<template>
  <div class="Edit">
    <h1>Modifier les informations de l'entreprise</h1>
    <form @submit.prevent="submitForm">
      <div class="detail-short">
        <label for="name">Nom</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>
      <div class="detail-long">
        <label for="description">Description</label>
        <input type="text" id="description" v-model="form.description" required />
      </div>
      <div class="detail-long">
        <label for="address">Adresse</label>
        <input type="text" id="address" v-model="form.address" required />
      </div>
      <div class="detail-short">
        <label for="phone">Téléphone </label>
        <input type="text" id="phone" v-model="form.phone" required />
      </div>
      <div class="detail-short">
        <label for="dist">Distance </label>
        <input type="number" id="dist" v-model.number="form.dist" required />
      </div>
      <div class="detail-long">
        <label for="image">Image </label>
        <input type="file" id="image" @change="handleImageUpload" />
      </div>
      <div>
        <label>Liste des items à vendre</label> <br />
        <div v-if="form.items.length > 0" class="item-header">
          <span>Nom</span>
          <span class="price">Prix (€)</span>
          <span class="quantity">Quantité</span>
          <span>Image</span>
          <span>Date de fin d'offre</span>
          <span class="action">Action</span>
        </div>
        <div v-for="(item, index) in form.items" :key="index" class="item-row">
          <input
            type="text"
            v-model="item.name"
            placeholder="Nom de l'item"
            required
          />
          <input
            class="price"
            type="number"
            v-model.number="item.price"
            placeholder="Prix de l'item"
            required
          />
          <input
            class="quantity"
            type="number"
            v-model.number="item.quantity"
            placeholder="Quantité"
            required
          />
          <input type="file" @change="handleImageUploadForItem(index, $event)" />
          <input
            type="date"
            v-model="item.endDate"
            placeholder="Date de fin d'offre"
          />
          <button
            type="button"
            class="action"
            @click="removeItem(index)"
          >
            Supprimer
          </button>
        </div>
        <button type="button" @click="addItem">Ajouter un item</button>
      </div>
      <button type="submit" class="submit-button">Soumettre</button>
    </form>
  </div>
</template>

<script>
export default {
  name:"EditShop",
  props: {
    shopData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        address: "",
        phone: "",
        dist: 0,
        image: null,
        items: [],
      },
    };
  },
  mounted() {
  const savedShopData = localStorage.getItem("shopData");
  if (savedShopData) {
    this.form = JSON.parse(savedShopData); // Chargez les données dans le formulaire
    localStorage.removeItem("shopData"); // Supprimez les données après les avoir utilisées
  } else {
    console.error("shopData est manquant !");
  }
},

  methods: {
    async submitForm() {
      try {
        // Exemple d'utilisation d'une API de géocodage pour obtenir les coordonnées à partir de l'adresse
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            this.form.address
          )}&format=json&limit=1`
        );
        const data = await response.json();

        if (data.length > 0) {
          const posX = data[0].lon;
          const posY = data[0].lat;
          console.log("posX:", posX);
          console.log("posY:", posY);
        } else {
          console.error("Adresse introuvable");
        }
      } catch (error) {
        console.error("Erreur lors du géocodage:", error);
      }

      console.log("Données modifiées :", this.form);
      // Vous pouvez ici envoyer `this.form` à une API pour sauvegarder les modifications
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.image = file;
        console.log("Image uploadée :", file.name);
      }
    },
    handleImageUploadForItem(index, event) {
      const file = event.target.files[0];
      if (file) {
        this.form.items[index].image = file;
        console.log(`Image pour l'item ${index} uploadée :`, file.name);
      }
    },
    addItem() {
      this.form.items.push({
        name: "",
        price: 0,
        quantity: 1,
        endDate: null,
        image: null,
      });
    },
    removeItem(index) {
      this.form.items.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.Edit {
  min-width: 850px;
  max-width: 850px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 15px;
}

.detail-short {
  max-width: 10em;
}

.detail-long {
  max-width: 20em;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  text-align: left; /* Align label text to the left */
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
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

.item-row input,
.item-row button {
  flex: 1; /* Make them all share space equally */
  width: 0; /* Ensure elements don't shrink beyond content size */
  padding: 8px;
}

.item-header .price,
.item-header .quantity,
.item-header .action,
.item-row .price,
.item-row .quantity,
.item-row .action {
  flex: 0.5;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button[type="button"]:hover {
  background-color: #d32f2f;
}

</style>
