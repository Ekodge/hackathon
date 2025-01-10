import pb from '../config/pocketbaseConfig.js'; // Import your PocketBase configuration
import { getCartEntryTotalPrice } from './cartEntryService.js';
import {cancelCartEntry} from "./cartEntryService.js";
import {updateUser} from "./userService.js";
import {editShop} from "./shopService.js";


// Create a new cart
export async function createCart(cartData) {
    const res = await pb.collection('cart').create(cartData);
    await updateUser(res.idUser, {"listCart+": res.id});
    await editShop(res.idShop, {"listCart+": res.id});
    return res;
}

// Retrieve all carts
export async function getCarts() {
    return await pb.collection('cart').getFullList();
}

// Retrieve a single cart by ID
export async function getCartById(cartId) {
    return await pb.collection('cart').getOne(cartId);
}

// Update cart information
export async function updateCart(cartId, cartData) {
    return await pb.collection('cart').update(cartId, cartData);
}

// Delete a cart
export async function cancelAndDeleteCart(cartId) {
    return await pb.collection('cart').delete(cartId).then(async (res) => {
        await cancelCart(cartId);
        return res;
    });
}

export async function deleteCart(cartId) {
    return await pb.collection('cart').delete(cartId);
}

// Calculate the total price of all cart entries in a cart
export async function getCartTotalPrice(cartId) {
    // Fetch the cart and expand the related cart entries
    const cart = await getCartById(cartId);

    // Get the list of cart_entry IDs from the expanded field
    const cartEntries = cart.listCart_Entry;

    if (!cartEntries || cartEntries.length === 0) {
        return 0; // If no cart entries, total price is 0
    }

    // Calculate the total price for all cart entries
    let totalPrice = 0;
    for (const cartEntry of cartEntries) {
        const cartEntryTotalPrice = await getCartEntryTotalPrice(cartEntry);
        totalPrice += cartEntryTotalPrice;
    }

    return totalPrice;
}

// Cancel the cart and give back the items to the shop
export async function cancelCart(cartId) {
    // Fetch the cart and expand the related cart entries
    const cart = await getCartById(cartId);

    // Get the list of cart_entry IDs from the expanded field
    const cartEntries = cart.listCart_Entry;

    // Cancel each cart entry
    for (const cartEntry of cartEntries) {
        const cartEntryTotalPrice = await cancelCartEntry(cartEntry);
    }

    return await deleteCart(cartId);
}