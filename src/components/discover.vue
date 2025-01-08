<template>
  <div class="disco">
    <h1>{{ msg }}</h1>

    <div class="carousel-container">
      <div class="carousel-wrapper" ref="carousel">
        <!-- Utilisation de router-link pour les éléments cliquables -->
        <router-link v-for="(item, index) in items" :key="index" :to="`/${item.id}${item.name}`"
          class="carousel-slide no-link">

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
                  <p><strong>Adresse :</strong> <br> {{ item.address }}</p>
                  <p><strong>Téléphone :</strong> <br> {{ item.phone }}</p>
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
  </div>
</template>

<script>
export default {
  name: "ImageCarousel",
  props: {
    msg: String
  },
  data() {
    return {
      items: [
        {
          id: 1,
          name: "Entreprise A",
          address: "123 Rue Principale, Paris",
          phone: "01 23 45 67 89"
        },
        {
          id: 2,
          name: "Entreprise B",
          address: "456 Rue Secondaire, Lyon",
          phone: "04 56 78 90 12"
        },
        {
          id: 3,
          name: "Entreprise C",
          address: "789 Boulevard Central, Marseille",
          phone: "03 21 43 65 87"
        },
        {
          id: 4,
          name: "Entreprise D",
          address: "Place de la Mairie, Rennes",
          phone: "03 21 43 65 87"
        },
        {
          id: 4,
          name: "Entreprise D",
          address: "Place de la Mairie, Rennes",
          phone: "03 21 43 65 87"
        },
        {
          id: 4,
          name: "Entreprise D",
          address: "Place de la Mairie, Rennes",
          phone: "03 21 43 65 87"
        },
        {
          id: 4,
          name: "Entreprise D",
          address: "Place de la Mairie, Rennes",
          phone: "03 21 43 65 87"
        },
        {
          id: 4,
          name: "Entreprise D",
          address: "Place de la Mairie, Rennes",
          phone: "03 21 43 65 87"
        },
        {
          id: 4,
          name: "Entreprise D",
          address: "Place de la Mairie, Rennes",
          phone: "03 21 43 65 87"
        },
      ]
    };
  },
  methods: {
    scrollLeft() {
      const carousel = this.$refs.carousel;
      const slideWidth = carousel.querySelector(".carousel-slide").offsetWidth + 10; // Inclut l'espacement
      carousel.scrollBy({ left: -slideWidth, behavior: "smooth" });
    },
    scrollRight() {
      const carousel = this.$refs.carousel;
      const slideWidth = carousel.querySelector(".carousel-slide").offsetWidth + 10; // Inclut l'espacement
      carousel.scrollBy({ left: slideWidth, behavior: "smooth" });
    }
  }
};
</script>


<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  /* Masque les slides en dehors du cadre */
}

.carousel-wrapper {
  display: flex;
  gap: 20px;
  /* Espacement horizontal entre les slides (augmenté à 20px) */
  overflow-x: auto;
  /* Autorise le défilement horizontal */
  scroll-behavior: smooth;
  /* Défilement fluide */
}

.carousel-slide {
  display: flex;
  flex-shrink: 0;
  /* Empêche les slides de se rétrécir */
  width: 300px;
  /* Largeur fixe pour chaque slide */
  margin: 10px;
  background-color: #f9f9f9;
  /* Fond léger pour contraste */
  border-radius: 10px;
}

.no-link {
  text-decoration: none !important;
  color: black !important;
}

.info-table {
  width: 100%;
  table-layout: fixed;
  /* Garantit une disposition égale */
  border: 1px solid #ccc;
  /* Bordure autour des tableaux */
  border-radius: 10px;
  /* Optionnel : arrondit les coins des tableaux */
  border-collapse: separate;
  /* Empêche les cellules de fusionner les bordures */
  background: #fff;
  /* Fond blanc dans le tableau */
}

.image-cell {
  width: 40%;
  /* Image occupe 40% de la largeur */
}

.info-cell {
  width: 60%;
  /* Informations occupent 60% */
  padding-left: 10px;
  vertical-align: top;
}

.info-table td {
  border: 1px solid #ddd;
  /* Bordure autour des cellules */
  padding: 10px;
  /* Espacement interne des cellules */
}

.carousel-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  /* Bordures arrondies pour l'image */
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}
</style>