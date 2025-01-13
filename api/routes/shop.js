import { Router } from "express";
import multer from "multer";
import supabase from "../server.js"; // Assurez-vous que le fichier server.js configure correctement Supabase

const router = Router();
const upload = multer({ dest: "uploads/" });

// Route pour obtenir toutes les entreprises
router.get("/shop", async (req, res) => {
    try {
        const { data: shops, error } = await supabase.from("shop").select("*");

        if (error) throw error;

        res.json(shops);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des shops." });
    }
});

// Route pour obtenir les entreprises d'un owner spécifique
router.get("/shop/owner/:ownerId", async (req, res) => {
    const ownerId = req.params.ownerId;
    try {
        const { data: shops, error } = await supabase
            .from("shop")
            .select("*")
            .eq("idUser", ownerId);

        if (error) throw error;

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
        const { data: favorites, error } = await supabase
            .from("favorite")
            .select("idShop")
            .eq("idUser", userId);

        if (error) throw error;

        if (favorites.length > 0) {
            const favoriteShops = [];
            for (const fav of favorites) {
                const { data: shop, error: shopError } = await supabase
                    .from("shop")
                    .select("*")
                    .eq("id", fav.idShop)
                    .single();

                if (shopError) throw shopError;

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
        const { data: matchingShops, error } = await supabase
            .from("shop")
            .select("*")
            .ilike("name", `%${query}%`); // Recherche insensible à la casse

        if (error) throw error;

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
        const { data: shop, error } = await supabase
            .from("shop")
            .select("*")
            .eq("id", shopId)
            .single();

        if (error) throw error;

        res.status(200).json(shop);
    } catch (err) {
        res.status(404).json({ message: "Aucun shop trouvé avec cet ID." });
    }
});

// Route pour ajouter un nouveau shop
router.post("/shop", upload.single("image"), async (req, res) => {
    const { name, description, posX, posY, address, owner, dist, phone } = req.body;

    if (!name || !description || !posX || !posY || !address || !owner || !dist) {
        return res.status(400).json({ error: "Tous les champs obligatoires doivent être renseignés." });
    }

    try {
        const { data: newShop, error } = await supabase.from("shop").insert([
            {
                name,
                description,
                positionX: parseFloat(posX),
                positionY: parseFloat(posY),
                address,
                idUser: owner,
                dist,
                phone
            },
        ]);

        if (error) throw error;

        res.status(201).json(newShop);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création du shop." });
    }
});

// Route pour suivre un shop
router.post("/shop/follow", async (req, res) => {
    const { userId, shopId } = req.body;

    if (!userId || !shopId) {
        return res.status(400).json({ error: "Les champs userId et shopId sont requis." });
    }

    try {
        // Vérifier si le couple existe déjà
        const { data: existingFavorite, error: fetchError } = await supabase
            .from("favorite")
            .select("*")
            .eq("userId", userId)
            .eq("shopId", shopId)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError;
        }

        if (existingFavorite) {
            return res.status(400).json({ message: "Ce shop est déjà suivi par cet utilisateur." });
        }

        // Ajouter le couple userId et shopId dans la table favorite
        const { error: insertError } = await supabase
            .from("favorite")
            .insert([{ userId, shopId }]);

        if (insertError) throw insertError;

        res.status(200).json({ message: "Shop ajouté aux favoris avec succès." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'ajout du shop aux favoris." });
    }
});

// Route pour ne plus suivre un shop
router.post("/shop/unfollow", async (req, res) => {
    const { userId, shopId } = req.body;

    if (!userId || !shopId) {
        return res.status(400).json({ error: "Les champs userId et shopId sont requis." });
    }

    try {
        // Supprimer le couple userId et shopId de la table favorite
        const { error: deleteError } = await supabase
            .from("favorite")
            .delete()
            .match({ userId, shopId });

        if (deleteError) throw deleteError;

        res.status(200).json({ message: "Shop retiré des favoris avec succès." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la suppression du shop des favoris." });
    }
});


export default router;
