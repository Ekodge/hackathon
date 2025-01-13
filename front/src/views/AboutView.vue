<template>
  <div>
    <h1>Informations de l'utilisateur</h1>

    <!-- Display user information -->
    <div v-if="user">
      <p><strong>Nom :</strong> {{ user.name }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Téléphone :</strong> {{ user.phoneNumber }}</p>
    </div>

    <!-- Error message if data fetch fails -->
    <p v-else-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <!-- Loading message -->
    <p v-else>Chargement des informations utilisateur...</p>

    <!-- Logout button -->
    <button @click="logout" class="logout-btn">Déconnexion</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null, // Holds user information
      errorMessage: null, // Holds error messages
    };
  },
  mounted() {
    this.fetchUserDetails(); // Fetch user details on component mount
  },
  methods: {
    async fetchUserDetails() {
      const userId = localStorage.getItem("userId"); // Get user ID from localStorage

      if (!userId) {
        this.errorMessage = "Utilisateur non authentifié.";
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`); // Use GET to fetch user by ID
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des informations utilisateur.");
        }

        this.user = await response.json(); // Parse the JSON response
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur :", error);
        this.errorMessage = "Impossible de récupérer les informations utilisateur.";
      }
    },
    logout() {
      // Clear authentication status
      localStorage.removeItem("authenticated");
      localStorage.removeItem("userId");
      this.$router.push("/login"); // Redirect to login page
    },
  },
};
</script>

<style scoped>
.logout-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.error-msg {
  color: #e74c3c;
  font-weight: bold;
}
</style>
