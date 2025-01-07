<template>
    <div class="login-container">
      <h1>Connexion</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Nom d'utilisateur :</label>
          <input id="username" v-model="username" type="text" required />
        </div>
        <div>
          <label for="password">Mot de passe :</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      handleLogin() {
        // Vérifiez les identifiants (nom = "n", mot de passe = "p")
        if (this.username === 'n' && this.password === 'p') {
          // Stocker une variable indiquant que l'utilisateur est authentifié
          localStorage.setItem('authenticated', 'true');
          this.$router.push('/'); // Rediriger vers la page principale
        } else {
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
        }
      },
    },
  };
  </script>
  
  <style>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  