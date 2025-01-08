const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Données simulées
const users = [
    {
        username: "n",
        password: "p",
    },
];

const items = [
    {
        id: 1,
        name: "Entreprise A",
        address: "123 Rue Principale, Paris",
        phone: "01 23 45 67 89",
    },
    {
        id: 2,
        name: "Entreprise B",
        address: "456 Rue Secondaire, Lyon",
        phone: "04 56 78 90 12",
    },
    {
        id: 3,
        name: "Entreprise C",
        address: "789 Boulevard Central, Marseille",
        phone: "03 21 43 65 87",
    },
    {
        id: 4,
        name: "Entreprise D",
        address: "Place de la Mairie, Rennes",
        phone: "03 21 43 65 87",
    },
];

// Route pour l'authentification
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        res.status(200).json({ message: "Connexion réussie" });
    } else {
        res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }
});

// Route pour obtenir les entreprises
app.get("/api/companies", (req, res) => {
    res.json(items);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`API en cours d'exécution sur http://localhost:${PORT}`);
});
