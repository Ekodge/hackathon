const PocketBase = require('pocketbase').default; // Ajoutez `.default`
const dotenv = require('dotenv');

// Charger le fichier .env
dotenv.config();

const pb = new PocketBase("http://127.0.0.1:8090/");

module.exports = pb;
