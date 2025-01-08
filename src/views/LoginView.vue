<template>
    <div class="login-container">
      <h1>Connexion</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="email">Adresse e-mails :</label>
          <input id="email" v-model="email" type="text" required />
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
        email: "",
        password: "",
        errorMessage: "",
        userId: null,
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,  
            }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("userId", data.userId);
            this.$router.push("/"); // Redirige vers la page principale
          } else {
            const error = await response.json();
            this.errorMessage = error.message;
          }
        } catch (err) {
          console.error("Erreur lors de la connexion :", err);
          this.errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
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
  