import { Router } from "express";
const router = Router();

import pb from "../server.js";

// Route pour obtenir un item à partir de son ID
router.get("/item/:id", async (req, res) => {
    const itemId = req.params.id; // Récupérer l'ID de l'item depuis l'URL

    try {
        const item = await pb.collection("items").getOne(itemId); // Rechercher l'item dans PocketBase
        res.status(200).json(item); // Retourner l'item si trouvé
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Item non trouvé" }); // Si aucun item trouvé
    }
});

// Route pour ajouter un nouvel item
router.post("/item", async (req, res) => {
    const { name, quantity, price, endDate } = req.body;

    if (!name || quantity == null || price == null || !endDate) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const newItem = await pb.collection("items").create({
            name,
            quantity,
            price,
            endDate,
        });
        res.status(201).json({ message: "Item ajouté avec succès.", item: newItem });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de l'ajout de l'item." });
    }
});

// Route pour mettre à jour un item existant
router.put("/item/:id", async (req, res) => {
    const itemId = req.params.id;
    const updates = req.body;

    try {
        const updatedItem = await pb.collection("items").update(itemId, updates);
        res.status(200).json({ message: "Item mis à jour avec succès.", item: updatedItem });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'item." });
    }
});

// Route pour supprimer un item
router.delete("/item/:id", async (req, res) => {
    const itemId = req.params.id;

    try {
        await pb.collection("items").delete(itemId);
        res.status(200).json({ message: "Item supprimé avec succès." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'item." });
    }
});

export default router;
