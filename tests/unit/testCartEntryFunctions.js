import {
    createCartEntry,
    getCartEntries,
    getCartEntryById,
    updateCartEntry,
    deleteCartEntry
} from '../../src/services/cartEntryService.js';

import {login, logout, getUserInfo} from '../../src/services/auth.js';
//login with valid credentials for superuser
await login(process.env.SUPERUSER_EMAIL, process.env.SUPERUSER_PASSWORD,);

// Create a test cart entry
const testCartEntry = {
    idCart: "x9lp75212k0q91n",
    idItem: "x003av84gzer4m0",
    quantity: 1,
};

// Create a new cart entry
const createdCartEntry = await createCartEntry(testCartEntry);
console.log("Cart entry created:", createdCartEntry);

// Retrieve the list of all cart entries
const cartEntries = await getCartEntries();
console.log("List of cart entries:", cartEntries);

// Retrieve a cart entry by its ID
const retrievedCartEntry = await getCartEntryById(createdCartEntry.id);
console.log("Retrieved cart entry:", retrievedCartEntry);

// Update the cart entry
const updatedCartEntry = await updateCartEntry(createdCartEntry.id, { quantity: 10 });
console.log("Updated cart entry:", updatedCartEntry);

// Delete the cart entry
//await deleteCartEntry(createdCartEntry.id);
//console.log("Cart entry deleted successfully");
