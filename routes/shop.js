const express = require("express");
const router = express.Router();

const shops = [
    {
        id: 1,
        name: "Entreprise A",
        description: "a",
        address: "123 Rue Principale, Paris",
        posX: "0.0",
        posY: "0.0",
        phone: "01 23 45 67 89",
        owner: 1,
        dist:1,
        posCalcule: False

    },
    {
        id: 2,
        name: "Entreprise B",
        description: "a",
        address: "456 Rue Secondaire, Lyon",
        posX: "0.0",
        posY: "0.0",
        phone: "04 56 78 90 12",
        owner: 1,
        dist:6,
        posCalcule: False

    },
    {
        id: 3,
        name: "Entreprise C",
        description: "a",
        address: "789 Boulevard Central, Marseille",
        posX: "0.0",
        posY: "0.0",
        phone: "03 21 43 65 87",
        owner: 2,
        dist:19,
        posCalcule: False
    },
    {
        id: 4,
        name: "Entreprise D",
        description: "a",
        address: "Place de la Mairie, Rennes",
        posX: "0.0",
        posY: "0.0",
        phone: "03 21 43 65 87",
        owner: 3,
        dist:21,
        posCalcule: False

    },
    {
        id: 5,
        name: "Entreprise E",
        description: "a",
        address: "Terre",
        posX: "0.0",
        posY: "0.0",
        phone: "00 00 00 00 00",
        owner: 3,
        dist:10000,
        posCalcule: False
    },
];

const favorites = [
    {
        userId: 1,
        shopId: 1,
    },
    {
        userId: 1,
        shopId: 5,
    },
];

// Route pour obtenir toutes les entreprises
router.get("/shop", (req, res) => {
    res.json(shops);
});

// Route pour obtenir les entreprises d'un owner spécifique
router.get("/shop/owner/:ownerId", (req, res) => {
    const ownerId = parseInt(req.params.ownerId); // Récupère l'ID du propriétaire depuis l'URL
    const ownerShops = shops.filter(item => item.owner === ownerId); // Filtre les entreprises par ownerId

    if (ownerShops.length > 0) {
        res.json(ownerShops); // Retourne les entreprises correspondantes
    } else {
        res.status(404).json({ message: "Aucune entreprise trouvée pour cet owner" }); // Si aucun résultat
    }
});

// Route pour obtenir les favoris d'un utilisateur spécifique
router.get("/shop/favorites/:userId", (req, res) => {
    const userId = parseInt(req.params.userId); // Récupère l'ID de l'utilisateur depuis l'URL

    // Filtrer les favoris de cet utilisateur
    const userFavorites = favorites.filter(fav => fav.userId === userId);

    if (userFavorites.length > 0) {
        // Récupérer les informations sur les entreprises correspondant aux favoris
        const favoriteShops = userFavorites.map(fav => {
            return shops.find(item => item.id === fav.shopId); // Trouver chaque entreprise par son ID
        });

        res.json(favoriteShops); // Retourner les entreprises favorites
    } else {
        res.status(404).json({ message: "Aucun favori trouvé pour cet utilisateur" }); // Si aucun favori trouvé
    }
});

// Route pour rechercher les shops par nom
router.get("/shop/search", (req, res) => {
    const { query } = req.query; // Récupère le texte passé dans la requête (paramètre `query`)

    if (!query) {
        return res.status(400).json({ message: "Veuillez fournir un texte à rechercher dans le paramètre 'query'." });
    }

    // Filtrer les shops dont le nom contient le texte (insensible à la casse)
    const matchingShops = shops.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    if (matchingShops.length > 0) {
        res.status(200).json(matchingShops); // Retourner les shops correspondants
    } else {
        res.status(404).json({ message: "Aucun shop trouvé avec ce texte." }); // Si aucun résultat
    }
});

// Route pour obtenir un shop par son ID
router.get("/shop/:id", (req, res) => {
    const shopId = parseInt(req.params.id); // Récupère l'ID du shop depuis l'URL

    // Recherche du shop correspondant à l'ID
    const shop = shops.find(item => item.id === shopId);

    if (shop) {
        res.status(200).json(shop); // Retourne les détails du shop trouvé
    } else {
        res.status(404).json({ message: "Aucun shop trouvé avec cet ID." }); // Si aucun résultat
    }
});

module.exports = router;
