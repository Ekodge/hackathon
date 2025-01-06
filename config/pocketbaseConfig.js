const PocketBase = require('pocketbase');

const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase server URL
module.exports = pb;
