const express = require("express");
const router = express.Router();

const users = [
    {
        id: 1,
        username: "a",
        password: "a",
    },
    {
        id: 2,
        username: "b",
        password: "b",
    },
    {
        id: 3,
        username: "c",
        password: "c",
    },
];

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        res.status(200).json({
            message: "Connexion réussie",
            userId: user.id, // Ajout de l'ID de l'utilisateur dans la réponse
        });
    } else {
        res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }
});

module.exports = router;
