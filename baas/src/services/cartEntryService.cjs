import pb from '../config/pocketbaseConfig.cjs';
import {updateItem} from './itemService.cjs';
import * as math from 'mathjs';
import {updateUser} from "./userService.cjs";
import {editShop} from "./shopService.cjs";
import {updateCart} from "./cartService.cjs";

// Create a new cart entry
export async function createCartEntry(cartEntryData) {
    // Check first if there is enough quantity of the item
    const item = await pb.collection('item').getOne(cartEntryData.idItem);
    if (!item) {
        throw new Error(`Item with ID ${cartEntryData.idItem} not found.`);
    }
    if (cartEntryData.quantity) {
        if (item.quantity < cartEntryData.quantity) {
            throw new Error(`Not enough quantity of item with ID ${cartEntryData.idItem}.`);
        }
    }
    const res = await pb.collection('cart_entry').create(cartEntryData);
    await updateItem(cartEntryData.idItem, { quantity: math.subtract(item.quantity, cartEntryData.quantity),"listCart_Entry+": res.id });
    await updateCart(cartEntryData.idCart, {"listCart_Entry+": res.id});
    return res;
}

// Retrieve all cart entries
export async function getCartEntries() {
    return await pb.collection('cart_entry').getFullList();
}

// Retrieve a single cart entry by ID
export async function getCartEntryById(cartEntryId) {
    return await pb.collection('cart_entry').getOne(cartEntryId);
}

// Update cart entry information
export async function updateCartEntry(cartEntryId, cartEntryData) {
    // if quantity is updated, check if there is enough quantity of the item by checking the difference between the new quantity and the old quantity
    if (cartEntryData.quantity) {
        const cartEntry = await getCartEntryById(cartEntryId);
        const oldQuantity = cartEntry.quantity;
        const newQuantity = cartEntryData.quantity;
        const diff = math.subtract(newQuantity, oldQuantity);
        const item = await pb.collection('item').getOne(cartEntry.idItem);
        if(diff > 0) {
            if (!item) {
                throw new Error(`Item with ID ${cartEntryData.idItem} not found.`);
            }
            if (item.quantity < diff) {
                throw new Error(`Not enough quantity of item with ID ${cartEntryData.idItem}.`);
            }
            await updateItem(cartEntry.idItem, { quantity: math.subtract(item.quantity, diff) });
        }
        else if(diff <= 0) {
            await updateItem(cartEntry.idItem, { quantity: math.add(item.quantity, math.abs(diff)) });
        }
    }
    return await pb.collection('cart_entry').update(cartEntryId, cartEntryData);
}

// Delete a cart entry
export async function deleteCartEntry(cartEntryId) {
    return await pb.collection('cart_entry').delete(cartEntryId);
}

// Get Total Price of a Cart Entry
export async function getCartEntryTotalPrice(cartEntryId) {
    // Fetch the cart entry
    const cartEntry = await getCartEntryById(cartEntryId);

    // Fetch the related item
    const item = await pb.collection('item').getOne(cartEntry.idItem);

    // Calculate total price (item price * quantity)
    return item.price * cartEntry.quantity;
}

// Cancel a cart entry
export async function cancelCartEntry(cartEntryId) {
    // Fetch the cart entry
    const cartEntry = await getCartEntryById(cartEntryId);

    if (!cartEntry) {
        throw new Error(`Cart entry with ID ${cartEntryId} not found.`);
    }

    // Get the related item
    const item = await pb.collection('item').getOne(cartEntry.idItem);

    // Update the item quantity
    await updateItem(item.id, { quantity: math.add(item.quantity, cartEntry.quantity) });

    // Delete the cart entry
    return await deleteCartEntry(cartEntryId);
}
