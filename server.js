const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utilisation des routes
app.use("/api", authRoutes);  // Authentification
app.use("/api", shopRoutes);  // Échoppe

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`API en cours d'exécution sur http://localhost:${PORT}`);
});
