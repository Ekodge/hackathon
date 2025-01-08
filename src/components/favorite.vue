<template>
  <div class="fav">
    <h1>{{ msg }}</h1>

    <div class="carousel-container" v-if="items.length">
      <div class="carousel-wrapper" ref="carousel">
        <!-- Utilisation de router-link pour les éléments cliquables -->
        <router-link
          v-for="(item, index) in items"
          :key="index"
          :to="`/${item.id}${item.name}`"
          class="carousel-slide no-link"
        >
          <table class="info-table">
            <tbody>
              <tr>
                <!-- Colonne gauche : Image -->
                <td class="image-cell">
                  <img :src="require(`@/assets/logo.png`)" alt="Logo" class="carousel-image" />
                </td>
                <!-- Colonne droite : Informations -->
                <td class="info-cell">
                  <p><strong>{{ item.name }}</strong></p>
                  <p><strong>Adresse :</strong> <br />{{ item.address }}</p>
                  <p><strong>Téléphone :</strong> <br />{{ item.phone }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </router-link>
      </div>
      <!-- Boutons pour naviguer -->
      <button class="carousel-btn prev" @click="scrollLeft">⬅</button>
      <button class="carousel-btn next" @click="scrollRight">➡</button>
    </div>
    <p v-else>Chargement des données...</p>
  </div>
</template>

<script>
export default {
  name: "ImageCarousel",
  props: {
    msg: String,
  },
  data() {
    return {
      items: [], // Initialisé vide pour stocker les données de l'API
    };
  },
  methods: {
    async fetchItems() {
      try {
        const response = await fetch("http://localhost:3000/api/companies");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        this.items = await response.json();
      } catch (error) {
        console.error("Erreur : ", error.message);
      }
    },
    scrollLeft() {
      const carousel = this.$refs.carousel;
      const slideWidth = carousel.querySelector(".carousel-slide").offsetWidth + 10; // Inclut l'espacement
      carousel.scrollBy({ left: -slideWidth, behavior: "smooth" });
    },
    scrollRight() {
      const carousel = this.$refs.carousel;
      const slideWidth = carousel.querySelector(".carousel-slide").offsetWidth + 10; // Inclut l'espacement
      carousel.scrollBy({ left: slideWidth, behavior: "smooth" });
    },
  },
  mounted() {
    this.fetchItems(); // Appel à l'API lors du montage du composant
  },
};
</script>

<style scoped>
/* Styles inchangés */
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-wrapper {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
}

.carousel-slide {
  display: flex;
  flex-shrink: 0;
  width: 300px;
  margin: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.no-link {
  text-decoration: none !important;
  color: black !important;
}

.info-table {
  width: 100%;
  table-layout: fixed;
  border: 1px solid #ccc;
  border-radius: 10px;
  border-collapse: separate;
  background: #fff;
}

.image-cell {
  width: 40%;
}

.info-cell {
  width: 60%;
  padding-left: 10px;
  vertical-align: top;
}

.info-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.carousel-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px; /* Largeur fixe */
  height: 40px; /* Hauteur fixe identique */
  cursor: pointer;
  z-index: 10;
  display: flex; /* Centre le contenu du bouton */
  align-items: center;
  justify-content: center;
  border-radius: 10px; /* Ajoute cette ligne pour empêcher les bords arrondis */
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}
</style>
