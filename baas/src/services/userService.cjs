import pb from '../config/pocketbaseConfig.cjs'; // Import your PocketBase configuration
import { addItem, addShop, addUser, changeItem, changeShop, changeUser, getItem, getShop, getShops, getUser } from "./db_tmp.cjs"

// Create a new user
export async function createUser(userData) {
    return await pb.collection('user').create(userData);
}

// Retrieve all users
export async function getUsers() {
    return await pb.collection('user').getFullList();
}

// Retrieve a single user by ID
export async function getUserById(userId) {
    return await pb.collection('user').getOne(userId);
}

// Update user information
export async function updateUser(userId, userData) {
     return await pb.collection('user').update(userId, userData);
}


// Delete a user
export async function deleteUser(userId) {
    return await pb.collection('user').delete(userId);
    }

export async function followShop(userId, shopId) {
    await changeShop(shopId, { "followers+": userId })
    await updateUser(userId, { "followedShop+": shopId })
}
export async function unfollowShop(userId, shopId) {
    await changeShop(shopId, { "followers-": userId })
    await updateUser(userId, { "followedShop-": shopId })
}
