const express = require('express');
const app = express();
const port = 3000;

// Données statiques
const items = [
    {
        id: 1,
        name: "Entreprise A",
        address: "123 Rue Principale, Paris",
        phone: "01 23 45 67 89",
    },
    {
        id: 2,
        name: "Entreprise B",
        address: "456 Rue Secondaire, Lyon",
        phone: "04 56 78 90 12",
    },
    {
        id: 3,
        name: "Entreprise C",
        address: "789 Boulevard Central, Marseille",
        phone: "03 21 43 65 87",
    },
    {
        id: 4,
        name: "Entreprise D",
        address: "Place de la Mairie, Rennes",
        phone: "03 21 43 65 87",
    },
];

// Endpoint pour récupérer toutes les entreprises
app.get('/api/companies', (req, res) => {
    res.json(items);
});

// Endpoint pour récupérer une entreprise par ID
app.get('/api/companies/:id', (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = items.find(item => item.id === companyId);

    if (company) {
        res.json(company);
    } else {
        res.status(404).json({ error: 'Entreprise non trouvée' });
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`API en cours d'exécution sur http://localhost:${port}`);
});
