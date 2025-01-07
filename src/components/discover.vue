<template>
    <div class="disco">
      <div class="carousel-container">
        <div class="carousel-wrapper" ref="carousel">
          <img 
            v-for="(image, index) in images" 
            :key="index" 
            :src="require(`@/assets/logo.png`)" 
            alt="Logo" 
            class="carousel-image" 
          />
        </div>
        <!-- Boutons pour naviguer -->
        <button class="carousel-btn prev" @click="scrollLeft">⬅</button>
        <button class="carousel-btn next" @click="scrollRight">➡</button>
      </div>
  
      <!-- Autres contenus HTML -->
      <h1>{{ msg }}</h1>
      <p>
        For a guide and recipes on how to configure / customize this project,<br />
        check out the
        <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
      </p>
      <h3>Installed CLI Plugins</h3>
      <ul>
        <li>
          <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a>
        </li>
        <li>
          <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a>
        </li>
      </ul>
      <h3>Essential Links</h3>
      <ul>
        <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
        <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
        <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
        <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
        <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
      </ul>
      <h3>Ecosystem</h3>
      <ul>
        <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
        <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
        <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
        <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
        <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "ImageCarousel",
    data() {
      return {
        images: Array(3).fill(require('@/assets/logo.png')), // <- Le nombre d'images change ici
        msg: "Welcome to Vue!",
      };
    },
    methods: {
      scrollLeft() {
        const carousel = this.$refs.carousel;
        const imageWidth = carousel.querySelector(".carousel-image").offsetWidth + 10; // 10px pour le gap
        carousel.scrollBy({ left: -imageWidth, behavior: "smooth" });
      },
      scrollRight() {
        const carousel = this.$refs.carousel;
        const imageWidth = carousel.querySelector(".carousel-image").offsetWidth + 10; // 10px pour le gap
        carousel.scrollBy({ left: imageWidth, behavior: "smooth" });
      },
    },
  };
  </script>
  
  <style scoped>
  .carousel-container {
    position: relative;
    width: 100%;
    overflow: hidden; /* Masque les images en dehors du cadre */
  }
  
  .carousel-wrapper {
    display: flex;
    gap: 10px; /* Espacement entre les images */
    overflow-x: auto; /* Autorise le défilement horizontal */
    scroll-behavior: smooth; /* Défilement fluide */
  }
  
  .carousel-image {
    width: 200px; /* Ajustez la taille de vos images */
    height: auto;
    flex-shrink: 0; /* Empêche les images de se rétrécir */
    border-radius: 10px; /* Optionnel : bordures arrondies */
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
  
  h3 {
    margin: 40px 0 0;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  a {
    color: #42b983;
  }
  
  .header-image {
    width: 100px; /* Largeur fixe */
    height: 100px; /* Hauteur fixe */
    object-fit: cover; /* pour une meilleure mise en forme */
    margin-bottom: 20px; /* espace sous l'image */
  }
  </style>
  