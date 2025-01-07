<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Favorite msg="Welcome to Your Fav App"/>
    <Discover msg="Welcome to Your Disco App"/>

  </div>
</template>

<script>
// @ is an alias to /src
import Discover from '@/components/discover.vue'
import Favorite from '@/components/favorite.vue';

export default {
  name: 'HomeView',
  components: {
    Favorite,
    Discover
  }
}
</script>
