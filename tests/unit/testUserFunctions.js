import { createUser, getUsers, getUserById, updateUser, deleteUser, followShop, unfollowShop } from '../../src/services/userService.js';

import {login, logout, getUserInfo} from '../../src/services/auth.js';
//login with valid credentials for superuser
await login(process.env.SUPERUSER_EMAIL, process.env.SUPERUSER_PASSWORD,);

// Créer un utilisateur de test
const testUser = {
    nickname: "testUser",
    password: "testPassword",
    passwordConfirm: "testPassword",
    email: "testuser@example.com",
    followedShop: [],
};
const createdUser = await createUser(testUser);
console.log("Utilisateur créé :", createdUser);


// Récupérer la liste des utilisateurs
const users = await getUsers();
console.log("Liste des utilisateurs :", users);

// Récupérer un utilisateur par son ID
await getUserById(createdUser.id);

// Mettre à jour un utilisateur
await updateUser(createdUser.id, { nickname: "newNickname" });

// Suivre un magasin
//await followShop(createdUser.id, "k850wrhhr7qd760");
//await followShop(createdUser.id, "35tod674i61axrl");

// Ne plus suivre un magasin
//await unfollowShop(createdUser.id, "k850wrhhr7qd760");

// Delete a user
//await deleteUser(createdUser.id);
