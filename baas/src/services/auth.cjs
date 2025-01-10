const pb = require('../config/pocketbaseConfig.cjs');

// Fonction de login
async function login(email, password) {
    logout();
    
    if (typeof email !== "string" || typeof password !== "string") {
        return false;
    }

    try {
        await pb.collection("user").authWithPassword(email, password, { autoRefreshThreshold: 60 * 30 });
        console.log("Logged in as user");
        console.log("User Valid : ", pb.authStore.isValid);
        console.log("User Token : ", pb.authStore.token);
        console.log("User ID : ", pb.authStore.model?.id);
        return true;
    } catch (userError) {
        try {
            await pb.collection("_superusers").authWithPassword(email, password, { autoRefreshThreshold: 60 * 30 });
            console.log("Logged in as superuser");
            console.log("User Valid : ", pb.authStore.isValid);
            console.log("User Token : ", pb.authStore.token);
            console.log("User ID : ", pb.authStore.model?.id);
            return true;
        } catch (superuserError) {
            console.error("Failed to log in as either user or superuser:", superuserError);
            return false;
        }
    }
}

// Fonction de logout
function logout() {
    pb.authStore.clear();
}

// Fonction pour récupérer les informations de l'utilisateur
function getUserInfo() {
    return {
        id: pb.authStore.model.id,
        email: pb.authStore.model.email,
        token: pb.authStore.token,
    };
}

module.exports = {
    login,
    logout,
    getUserInfo,
};
