import { Router } from "express";
const router = Router();

import pb from "../server.js"; // Importation de l'instance PocketBase

// Route pour enregistrer un nouvel utilisateur
router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const newUser = await pb.collection("users").create({
            email,
            username,
            password,
        });
        res.status(201).json({ message: "Utilisateur créé avec succès.", user: newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'utilisateur." });
    }
});

// Route pour connecter un utilisateur
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis." });
    }

    try {
        const users = await pb.collection("users").getFullList({
            filter: `email = "${email}"`,
        });

        if (users.length === 0) {
            return res.status(401).json({ message: "Utilisateur non trouvé." });
        }

        const user = users[0];
        if (user.password === password) {
            res.status(200).json({
                message: "Connexion réussie",
                userId: user.id,
            });
        } else {
            res.status(401).json({ message: "Mot de passe incorrect." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la connexion." });
    }
});

// Route pour mettre à jour un utilisateur
router.put("/user/:id", async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    try {
        const updatedUser = await pb.collection("users").update(userId, updates);
        res.status(200).json({ message: "Utilisateur mis à jour avec succès.", user: updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur." });
    }
});

// Route pour supprimer un utilisateur
router.delete("/user/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        await pb.collection("users").delete(userId);
        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur." });
    }
});

export default router;
