import { createCart, getCarts, getCartById, updateCart, deleteCart } from '../../src/services/cartService.js';

import {login, logout, getUserInfo} from '../../src/services/auth.js';
//login with valid credentials for superuser
await login(process.env.SUPERUSER_EMAIL, process.env.SUPERUSER_PASSWORD,);

// Create a test cart
const testCart = {
    idUser: "6p9975s30bpynox", // Replace with a valid user ID from your database
    idShop: "35tod674i61axrl", // Replace with a valid shop ID from your database
};

// Create a new cart
const createdCart = await createCart(testCart);
console.log("Cart created:", createdCart);

// Retrieve the list of all carts
const carts = await getCarts();
console.log("List of carts:", carts);

// Retrieve a cart by its ID
const retrievedCart = await getCartById(createdCart.id);
console.log("Retrieved cart:", retrievedCart);

// Update the cart
const updatedCart = await updateCart(createdCart.id, { idShop: "3an8ns22d5754iv" }); // Replace with a valid updated user ID
console.log("Updated cart:", updatedCart);

// Delete the cart
//await deleteCart(createdCart.id);
console.log("Cart deleted successfully");
