import {
    createCartEntry,
    getCartEntries,
    getCartEntryById,
    updateCartEntry,
    deleteCartEntry,
    cancelCartEntry,
    getCartEntryTotalPrice
} from '../../src/services/cartEntryService.js';

import {login, logout, getUserInfo} from '../../src/services/auth.js';
//login with valid credentials for superuser
await login(process.env.SUPERUSER_EMAIL, process.env.SUPERUSER_PASSWORD,);

import { createCart, getCarts, getCartById, updateCart, deleteCart, getCartTotalPrice,cancelCart } from '../../src/services/cartService.js';

const cartEntryId = "b3je35r79vwd2y5";

// Retrieve the list of all cart entries
const cartEntries = await getCartEntries();
console.log("List of cart entries:", cartEntries);

// Retrieve a cart entry by its ID
const retrievedCartEntry = await getCartEntryById(cartEntryId);
console.log("Retrieved cart entry:", retrievedCartEntry);

// Update the cart entry
const updatedCartEntry = await updateCartEntry(cartEntryId, { quantity: 11 });
console.log("Updated cart entry:", updatedCartEntry);

const totalPrice = await getCartTotalPrice(retrievedCartEntry.idCart);
console.log("Total price of cart:", totalPrice);

const totalPriceofCartEntry = await getCartEntryTotalPrice(cartEntryId);
console.log("Total price of cartEntry:", totalPriceofCartEntry);

// Cancel and Delete the cart entry
//const canceledCartEntry = await cancelCartEntry(cartEntryId);
//console.log("Cart entry canceled:", canceledCartEntry);

// Delete the cart entry
//await deleteCartEntry(cartEntryId);
//console.log("Cart entry deleted successfully");

// Cancel Cart and Delete all cart entries
const canceledCart = await cancelCart(retrievedCartEntry.idCart);
console.log("Cart canceled:", canceledCart);
