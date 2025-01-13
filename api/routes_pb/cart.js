import { Router } from "express";
const router = Router();

import pb from "../server.js";

// Route pour obtenir le panier d'un utilisateur
router.get("/cart/:userId", async (req, res) => {
    const userId = req.params.userId; // Récupérer l'ID de l'utilisateur depuis l'URL

    try {
        const cart = await pb.collection("cart").getFullList({ filter: `userId="${userId}"` }); // Récupérer les items du panier
        res.status(200).json(cart); // Retourner les articles du panier
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Panier non trouvé" }); // Si le panier n'existe pas
    }
});

// Route pour ajouter un article au panier
router.post("/cart", async (req, res) => {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId || quantity == null) {
        return res.status(400).json({ error: "Tous les champs (userId, itemId, quantity) sont requis." });
    }

    try {
        const newCartItem = await pb.collection("cart").create({
            userId,
            itemId,
            quantity,
        });
        res.status(201).json({ message: "Article ajouté au panier avec succès.", cartItem: newCartItem });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de l'ajout de l'article au panier." });
    }
});

// Route pour mettre à jour la quantité d'un article dans le panier
router.put("/cart/:cartItemId", async (req, res) => {
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;

    if (quantity == null) {
        return res.status(400).json({ error: "La quantité est requise." });
    }

    try {
        const updatedCartItem = await pb.collection("cart").update(cartItemId, { quantity });
        res.status(200).json({ message: "Article mis à jour dans le panier.", cartItem: updatedCartItem });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'article dans le panier." });
    }
});

// Route pour supprimer un article du panier
router.delete("/cart/:cartItemId", async (req, res) => {
    const cartItemId = req.params.cartItemId;

    try {
        await pb.collection("cart").delete(cartItemId);
        res.status(200).json({ message: "Article supprimé du panier." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'article du panier." });
    }
});

export default router;
