import pb from './pocketbaseConfigSuperuser.js';
import {login, logout, getUserInfo} from '../../src/services/auth.js';
import {createUser, getUsers, getUserById, updateUser, deleteUser} from '../../src/services/userService.js';

function printUserInfo() {
    console.log("User Valid : ", pb.authStore.isValid);
    console.log("User Token : ", pb.authStore.token);
    console.log("User ID : ", pb.authStore.model?.id);
}

printUserInfo()

/*
login("alya.dudesert@gmail.com", "123456789").then((isLoggedIn) => {
    if (isLoggedIn) {
        // If login is successful
        console.log("Login successful!");
        printUserInfo();

        // Fetch the user record
        pb.collection("user").getOne(pb.authStore.record?.id).then((record) => {
            console.log("Record:", record);
            logout();
            printUserInfo();
        }).catch((error) => {
            console.error("Error fetching user record:", error);
        });

    } else {
        // If login failed
        console.log("Login failed. Please check your credentials.");
    }
}).catch((error) => {
    console.error("An error occurred during login:", error);
});
*/

await login("alya.dudesert@gmail.com", "123456789");
await pb.collection("user").getOne(pb.authStore.model.id).then((record) => {
    console.log("Record:", record);
}
).catch((error) => {
    console.error("Error fetching user record:", error);
});
printUserInfo();

logout()
printUserInfo();

await login("ethan.cadorel@hotmail.fr", "bdJAsUrSiQqEh6r");
printUserInfo();

await deleteUser("mhzf8qp3quo3e96");
await deleteUser("777r5b62s08k02b");





