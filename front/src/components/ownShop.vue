<template>
  <div class="own">
    <h1>{{ msg }}</h1>

    <!-- Carousel si des items existent -->
    <div class="carousel-container" v-if="items.length">
      <div class="carousel-wrapper" ref="carousel">
        <!-- Cartes cliquables -->
        <div
          v-for="(item, index) in items"
          :key="index"
          class="carousel-slide"
        >
          <router-link
            :to="`/shop/${item.id}`"
            class="carousel-link"
          >
            <div class="carousel-content">
              <table class="info-table">
                <tbody>
                  <tr>
                    <!-- Image -->
                    <td class="image-cell">
                      <img
                        :src="require(`@/assets/logo.png`)"
                        alt="Logo"
                        class="carousel-image"
                      />
                    </td>
                    <!-- Texte -->
                    <td class="info-cell">
                      <p><strong>{{ item.name }}</strong></p>
                      <p><strong>Adresse :</strong> <br />{{ item.address }}</p>
                      <p><strong>Téléphone :</strong> <br />{{ item.phone }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </router-link>
        </div>
        <a class="default-card no-link" href="/new-shop">
          <p><strong>Ajouter votre propre échoppe</strong></p>
        </a>
      </div>

      <!-- Boutons pour défiler -->
      <button class="carousel-btn prev" @click="scrollLeft">⬅</button>
      <button class="carousel-btn next" @click="scrollRight">➡</button>
    </div>

    <!-- Message ou contenu par défaut si pas d'items -->
    <div v-else>
      <p v-if="loading">Chargement des données...</p>
      <a class="default-card no-link" href="/new-shop" v-else>
        <img
          :src="require(`@/assets/logo.png`)"
          alt="Logo"
          class="default-image"
        />
        <p><strong>Ajouter votre propre échoppe</strong></p>
      </a>
    </div>
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
      items: [], // Liste des données
      loading: true, // Indicateur de chargement
    };
  },
  methods: {
    async fetchItems() {
      try {
        const userId = localStorage.getItem("userId"); // Récupère l'userId
        const response = await fetch(`http://localhost:3000/api/shop/owner/${userId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        this.items = await response.json();
      } catch (error) {
        console.error("Erreur : ", error.message);
      } finally {
        this.loading = false; // Le chargement est terminé
      }
    },
    scrollLeft() {
      const carousel = this.$refs.carousel;
      const slideWidth =
        carousel.querySelector(".carousel-slide").offsetWidth + 20; // Inclut le gap
      carousel.scrollBy({ left: -slideWidth, behavior: "smooth" });
    },
    scrollRight() {
      const carousel = this.$refs.carousel;
      const slideWidth =
        carousel.querySelector(".carousel-slide").offsetWidth + 20; // Inclut le gap
      carousel.scrollBy({ left: slideWidth, behavior: "smooth" });
    },
  },
  mounted() {
    this.fetchItems(); // Charger les données
  },
};
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
}

.carousel-wrapper {
  display: flex;
  gap: 20px; /* Espacement entre les cartes */
  overflow-x: auto;
  scroll-behavior: smooth;
}

.carousel-slide {
  display: flex;
  flex-shrink: 0;
  width: 300px; /* Largeur uniforme */
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer; /* Indique que la case est cliquable */
}

.carousel-link {
  display: block;
  text-decoration: none; /* Supprime le style des liens */
  color: inherit; /* Utilise la couleur par défaut */
  width: 100%;
  height: 100%;
}

.carousel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.image-cell {
  width: 40%;
  text-align: center;
  vertical-align: middle;
}

.info-cell {
  width: 60%;
  padding: 10px;
  vertical-align: top;
}

.carousel-image {
  max-width: 80%;
  margin: auto;
  display: block;
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

.default-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.default-image {
  width: 80px;
  height: auto;
  margin-bottom: 10px;
}

.no-link {
  text-decoration: none !important;
  color: black !important;
}
</style>
