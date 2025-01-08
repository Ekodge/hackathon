const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/companies");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utilisation des routes
app.use("/api", authRoutes);  // Authentification
app.use("/api", companyRoutes);  // Entreprises

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`API en cours d'exécution sur http://localhost:${PORT}`);
});
