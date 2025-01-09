import { Router } from "express";
const router = Router();

import pb from "../server.js";

// Route pour obtenir toutes les entreprises
router.get("/shop", async (req, res) => {
    try {
        const shops = await pb.collection("shop").getFullList();
        res.json(shops); // Retourner toutes les entreprises
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erreur lors de la récupération des shops." });
    }
});

// Route pour obtenir les entreprises d'un owner spécifique
router.get("/shop/owner/:ownerId", async (req, res) => {
    const ownerId = req.params.ownerId;
    try {
        const shops = await pb.collection("shop").getFullList({
            filter: `owner = ${ownerId}`, // Filtrer par ID du propriétaire
        });
        if (shops.length > 0) {
            res.json(shops);
        } else {
            res.status(404).json({ message: "Aucune entreprise trouvée pour cet owner." });
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des shops." });
    }
});

// Route pour obtenir les favoris d'un utilisateur spécifique
router.get("/shop/favorites/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const favorites = await pb.collection("favorites").getFullList({
            filter: `userId = ${userId}`, // Filtrer par ID utilisateur
        });

        if (favorites.length > 0) {
            const favoriteShops = [];
            for (const fav of favorites) {
                const shop = await req.pb.collection("shops").getOne(fav.shopId);
                favoriteShops.push(shop);
            }
            res.json(favoriteShops);
        } else {
            res.status(404).json({ message: "Aucun favori trouvé pour cet utilisateur." });
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des favoris." });
    }
});

// Route pour rechercher les shops par nom
router.get("/shop/search", async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Veuillez fournir un texte à rechercher dans le paramètre 'query'." });
    }

    try {
        const matchingShops = await pb.collection("shops").getFullList({
            filter: `name ~ "${query}"`, // Rechercher par nom (insensible à la casse)
        });
        if (matchingShops.length > 0) {
            res.status(200).json(matchingShops);
        } else {
            res.status(404).json({ message: "Aucun shop trouvé avec ce texte." });
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la recherche des shops." });
    }
});

// Route pour obtenir un shop par son ID
router.get("/shop/:id", async (req, res) => {
    const shopId = req.params.id;
    try {
        const shop = await pb.collection("shops").getOne(shopId);
        res.status(200).json(shop);
    } catch (err) {
        res.status(404).json({ message: "Aucun shop trouvé avec cet ID." });
    }
});

// Route pour ajouter un nouveau shop
router.post("/shop", async (req, res) => {
    const { name, description, address, phone, owner } = req.body;

    if (!name || !description || !address || !phone || !owner) {
        return res.status(400).json({ error: "Tous les champs obligatoires doivent être renseignés." });
    }

    try {
        const newShop = await pb.collection("shop").create({
            name,
            description,
            address,
            phone,
            owner,
        });
        res.status(201).json(newShop);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la création du shop." });
    }
});

// Route pour éditer un shop existant
router.put("/shop/:id", async (req, res) => {
    const shopId = req.params.id;
    const updates = req.body;

    try {
        const updatedShop = await pb.collection("shop").update(shopId, updates);
        res.status(200).json(updatedShop);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du shop." });
    }
});

// Route pour supprimer un shop
router.delete("/shop/:id", async (req, res) => {
    const shopId = req.params.id;

    try {
        await pb.collection("shop").delete(shopId);
        res.status(200).json({ message: "Shop supprimé avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la suppression du shop." });
    }
});

export default router;
