import { Router } from "express";
const router = Router();

import supabase from "../server.js";

// Route pour obtenir le panier d'un utilisateur
router.get("/cart/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Récupérer le panier de l'utilisateur
        const { data: cart, error: cartError } = await supabase
            .from("cart")
            .select("*")
            .eq("idUser", userId)
            .order("created", { ascending: false })
            .limit(1);

        if (cartError) {
            throw cartError;
        }

        if (!cart || cart.length === 0) {
            return res.status(404).json({ message: "Panier non trouvé." });
        }

        const cartId = cart[0].id;

        // Récupérer les items associés au panier
        const { data: cartEntries, error: entriesError } = await supabase
            .from("cart_entry")
            .select("*, item(*)") // Cela récupère aussi les détails de l'item
            .eq("idCart", cartId);

        if (entriesError) {
            throw entriesError;
        }

        res.status(200).json({ cart, items: cartEntries });
    } catch (err) {
        console.error("Erreur lors de la récupération du panier :", err);
        res.status(500).json({ message: "Erreur lors de la récupération du panier." });
    }
});

// Route pour ajouter un article au panier
router.post("/cart", async (req, res) => {
    const { userId, shopId, itemId, quantity } = req.body;

    if (!userId || !shopId || !itemId || quantity == null) {
        return res.status(400).json({ error: "Tous les champs (userId, itemId, quantity) sont requis." });
    }

    try {
        // Vérifier si le panier de l'utilisateur existe déjà
        const { data: cart, error: cartError } = await supabase
            .from("cart")
            .select("*")
            .eq("idUser", userId)
            .order("created", { ascending: false })
            .limit(1);

        if (cartError) throw cartError;

        // Si le panier n'existe pas, créez-le d'abord
        let cartId = cart && cart.length > 0 ? cart[0].id : null;
        if (!cartId) {
            const { data: newCart, error: newCartError } = await supabase
                .from("cart")
                .insert([{ idUser: userId, idShop: shopId }])
                .single();

            if (newCartError) throw newCartError;
            cartId = newCart.id;
        }

        // Ajouter l'article dans la table cart_entry
        const { data: newCartItem, error } = await supabase
            .from("cart_entry")
            .insert([{ idCart: cartId, idItem: itemId, quantity }])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json({ message: "Article ajouté au panier avec succès.", cartItem: newCartItem });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'article au panier :", err);
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
        const { data: updatedCartItem, error } = await supabase
            .from("cart")
            .update({ quantity })
            .eq("id", cartItemId);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: "Article mis à jour dans le panier.", cartItem: updatedCartItem });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'article dans le panier :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'article dans le panier." });
    }
});

// Route pour supprimer un article du panier
router.delete("/cart/:cartItemId", async (req, res) => {
    const cartItemId = req.params.cartItemId;

    try {
        const { error } = await supabase
            .from("cart")
            .delete()
            .eq("id", cartItemId);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: "Article supprimé du panier." });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'article du panier :", err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'article du panier." });
    }
});

export default router;
