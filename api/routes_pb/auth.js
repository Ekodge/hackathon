import { Router } from "express";
const router = Router();

import pb from "../server.js"; // Importation de l'instance PocketBase

// Route pour enregistrer un nouvel utilisateur
router.post("/register", async (req, res) => {
    const userData = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const newUser = await pb.collection('user').create(userData);
        res.status(201).json({ message: "Utilisateur créé avec succès.", user: newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'utilisateur." });
    }
});

// Route pour connecter un utilisateur
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Email et mot de passe requis." });
    }

    try {
        // Déconnecter l'utilisateur s'il est déjà connecté
        pb.authStore.clear();

        // Tentative de connexion en tant qu'utilisateur
        try {
            await pb.collection("user").authWithPassword(email, password, { autoRefreshThreshold: 60 * 30 });
            console.log("Connecté en tant qu'utilisateur");
            return res.status(200).json({
                message: "Connexion réussie",
                role: "user",
                userId: pb.authStore.model.id,
            });
        } catch (userError) {
            console.warn("Échec de connexion en tant qu'utilisateur, tentative en tant que superutilisateur...");

            // Tentative de connexion en tant que superutilisateur
            try {
                await pb.collection("_superusers").authWithPassword(email, password, { autoRefreshThreshold: 60 * 30 });
                console.log("Connecté en tant que superutilisateur");
                return res.status(200).json({
                    message: "Connexion réussie",
                    role: "superuser",
                    userId: pb.authStore.model.id,
                });
            } catch (superuserError) {
                console.error("Échec de connexion pour l'utilisateur et le superutilisateur");
                return res.status(401).json({ message: "Email ou mot de passe incorrect." });
            }
        }
    } catch (err) {
        console.error("Erreur lors de la tentative de connexion:", err);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Route pour mettre à jour un utilisateur
router.put("/user/:id", async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    try {
        const updatedUser = await pb.collection('user').update(userId, updates);
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
        await pb.collection('user').delete(userId);
        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur." });
    }
});

export default router;
