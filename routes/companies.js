const express = require("express");
const router = express.Router();

const items = [
    {
        id: 1,
        name: "Entreprise A",
        address: "123 Rue Principale, Paris",
        phone: "01 23 45 67 89",
        owner: 1,
    },
    {
        id: 2,
        name: "Entreprise B",
        address: "456 Rue Secondaire, Lyon",
        phone: "04 56 78 90 12",
        owner: 1,
    },
    {
        id: 3,
        name: "Entreprise C",
        address: "789 Boulevard Central, Marseille",
        phone: "03 21 43 65 87",
        owner: 2,
    },
    {
        id: 4,
        name: "Entreprise D",
        address: "Place de la Mairie, Rennes",
        phone: "03 21 43 65 87",
        owner: 3,
    },
];

// Route pour obtenir toutes les entreprises
router.get("/companies", (req, res) => {
    res.json(items);
});

// Route pour obtenir les entreprises d'un owner spécifique
router.get("/companies/owner/:ownerId", (req, res) => {
    const ownerId = parseInt(req.params.ownerId); // Récupère l'ID du propriétaire depuis l'URL
    const ownerCompanies = items.filter(item => item.owner === ownerId); // Filtre les entreprises par ownerId

    if (ownerCompanies.length > 0) {
        res.json(ownerCompanies); // Retourne les entreprises correspondantes
    } else {
        res.status(404).json({ message: "Aucune entreprise trouvée pour cet owner" }); // Si aucun résultat
    }
});

module.exports = router;
