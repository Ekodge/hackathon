import { Router } from "express";
const router = Router();

import supabase from "../server.js";

// Route pour enregistrer un nouvel utilisateur
router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });

        if (error) {
            throw error;
        }

        res.status(201).json({ message: "Utilisateur créé avec succès.", user: data });
    } catch (err) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", err);
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'utilisateur." });
    }
});

// Route pour connecter un utilisateur
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Email et mot de passe requis." });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Erreur de connexion :", error);
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        console.log("Utilisateur connecté :", data);
        return res.status(200).json({
            message: "Connexion réussie",
            role: "user",
            userId: data.user.id,
        });
    } catch (err) {
        console.error("Erreur lors de la tentative de connexion :", err);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Route pour mettre à jour un utilisateur
router.put("/user/:id", async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    try {
        const { data, error } = await supabase
            .from("user")
            .update(updates)
            .eq("id", userId);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: "Utilisateur mis à jour avec succès.", user: data });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur." });
    }
});

// Route pour supprimer un utilisateur
router.delete("/user/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const { error } = await supabase
            .from("user")
            .delete()
            .eq("id", userId);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur." });
    }
});

export default router;
