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
    <p>
      gallaisflorian01@gmail.com <br>
      aaaaaaaa
    </p>
  </div>
</template>

<script>
import { login, logout, getUserInfo } from '../../baas/src/services/auth.cjs';

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const isLoggedIn = await login(this.email, this.password);
        console.log(isLoggedIn)
        console.log(this.email)
        console.log(this.password)

        if (isLoggedIn) {
          const userInfo = getUserInfo();
          console.log("Utilisateur connecté :", userInfo);

          // Stocker les infos utilisateur dans localStorage si nécessaire
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("userId", userInfo.id);

          // Redirection vers la page principale
          this.$router.push("/");
        } else {
          this.errorMessage = "Adresse e-mail ou mot de passe incorrect.";
        }
      } catch (err) {
        console.error("Erreur lors de la connexion :", err);
        this.errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      }
    },
    handleLogout() {
      logout();
      localStorage.removeItem("authenticated");
      localStorage.removeItem("userId");
      console.log("Utilisateur déconnecté");
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