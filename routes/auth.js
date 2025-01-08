const express = require("express");
const router = express.Router();

const users = [
    {
        id: 1,
        email: "a",
        username: "a",
        password: "a",
    },
    {
        id: 2,
        email: "b",
        username: "b",
        password: "b",
    },
    {
        id: 3,
        email: "c",
        username: "c",
        password: "c",
    },
    {
        id: 4,
        email: "d",
        username: "d",
        password: "d",
    },
];

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        (u) => u.email === email && u.password === password
    );

    if (user) {
        res.status(200).json({
            message: "Connexion réussie",
            userId: user.id, // Ajout de l'ID de l'utilisateur dans la réponse
        });
    } else {
        res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
});

module.exports = router;
