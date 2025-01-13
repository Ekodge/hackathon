import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import itemRoutes from "./routes/item.js";
import shopRoutes from "./routes/shop.js";

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://yhzyfgirndllvyklvobd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloenlmZ2lybmRsbHZ5a2x2b2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NTk4NzcsImV4cCI6MjA1MjMzNTg3N30.DVhL1QGjoOGnPCfLOrTtlV8mwNsgGLDMI8a7_55mxMs')

const app = express();
const PORT = 3000;

export default supabase;

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
