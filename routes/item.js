const express = require("express");
const router = express.Router();

const items = [
    {
        id: 1,
        name: "Figurine de Shikanoko Nokonoko",
        quantity: 123456789,
        price: 123456789,
        endDate: "31/12/2099",
    },
];

// Route pour obtenir un item à partir de son ID
router.get("/items/:id", (req, res) => {
    const itemId = parseInt(req.params.id); // Récupérer l'ID de l'item depuis l'URL
    const item = items.find((i) => i.id === itemId); // Rechercher l'item par ID

    if (item) {
        res.status(200).json(item); // Retourner l'item si trouvé
    } else {
        res.status(404).json({ message: "Item non trouvé" }); // Si aucun item trouvé
    }
});

module.exports = router;
