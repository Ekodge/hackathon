import PocketBase from "pocketbase";
import creds from "./credsSelf.json" assert { type: "json" };

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import itemRoutes from "./routes/item.js";
import shopRoutes from "./routes/shop.js";

const app = express();
const PORT = 3000;

const pb = new PocketBase("http://127.0.0.1:8090");

await pb.collection('_superusers').authWithPassword(creds.mail, creds.pass, {
    autoRefreshThreshold: 30 * 60 // Auto refresh en cas de token expiré
});

pb.autoCancellation(false);

export default pb;

// Middleware généraux
app.use(cors());
app.use(bodyParser.json());

// Utilisation des routes
app.use("/api", authRoutes);  // Authentification
app.use("/api", cartRoutes);  // Panier
app.use("/api", itemRoutes);  // Produits
app.use("/api", shopRoutes);  // Échoppe

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`API en cours d'exécution sur http://localhost:${PORT}`);
});
