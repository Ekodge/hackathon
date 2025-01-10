import { createItem, getItems, getItemById, updateItem, deleteItem } from '../../src/services/itemService.cjs';

import {login, logout, getUserInfo} from '../../src/services/auth.cjs';
//login with valid credentials for superuser
await login(process.env.SUPERUSER_EMAIL, process.env.SUPERUSER_PASSWORD,);

// Create a test item
const testItem = {
    name: "testItem",
    quantity: 123,
    price: 123,
    endDate: "2022-01-01 10:00:00.123Z",
    idShop: "k850wrhhr7qd760", // Replace with a valid shop ID from your database
};

// Create a new item
const createdItem = await createItem(testItem);
console.log("Item created:", createdItem);

// Retrieve the list of all items
const items = await getItems();
console.log("List of items:", items);

// Retrieve an item by its ID
const retrievedItem = await getItemById(createdItem.id);
console.log("Retrieved item:", retrievedItem);

// Update the item
const updatedItem = await updateItem(createdItem.id, { name: "updatedTestItem" });
console.log("Updated item:", updatedItem);

// Delete the item
await deleteItem(createdItem.id);
console.log("Item deleted successfully");
