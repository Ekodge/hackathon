import {
    createShop,
    getAllShops,
    editShop,
    deleteShop,
    getShopListItem,
    searchShops
} from '../../src/services/shopService.cjs';

import {login, logout, getUserInfo} from '../../src/services/auth.cjs';
//login with valid credentials for superuser
await login(process.env.SUPERUSER_EMAIL, process.env.SUPERUSER_PASSWORD,);

// Create a test shop
const testShop = {
    name: "Test Shop",
    description: "This is a test shop.",
    positionX: 123,
    positionY: 123,
    address: "123 Test Street",
    idUser: "6p9975s30bpynox", // Replace with a valid user ID
    dist: 123,
};

const createdShop = await createShop(testShop);
console.log("Shop created:", createdShop);

// Retrieve the list of all shops
const shops = await getAllShops();
console.log("List of shops:", shops);

// Retrieve a shop's list of items
const items = await getShopListItem("8tx360vbq1467j9");
console.log("Shop's list of items:", items);

// Update the shop
await editShop(createdShop.id, {description: "Updated description."});
console.log("Shop updated successfully");

// Delete the shop
//await deleteShop(createdShop.id);
console.log("Shop deleted successfully");
