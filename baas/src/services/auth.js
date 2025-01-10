import pb from "../config/pocketbaseConfig.js";

// login function, need to add await to make it blocking
export async function login(email, password) {
    // Logout the user if they are already logged in
    logout();

    // If email and password are the wrong type, return an error
    if (typeof email !== "string" || typeof password !== "string") {
        return false; // Invalid email or password type
    }

    try {
        // Try to log in as a regular user
        await pb.collection("user").authWithPassword(email, password, { autoRefreshThreshold: 60 * 30 });
        console.log("Logged in as user");
        return true;
    } catch (userError) {
        try {
            // If regular user login fails, try to log in as a superuser
            await pb.collection("_superusers").authWithPassword(email, password, { autoRefreshThreshold: 60 * 30 });
            console.log("Logged in as superuser");
            return true;
        } catch (superuserError) {
            console.error("Failed to log in as either user or superuser:", superuserError);
            return false;
        }
    }
}


//logout function
export function logout() {
    // Clear the user's authentication information
    pb.authStore.clear();
}

export function getUserInfo() {
    return {
        id: pb.authStore.model.id,
        email: pb.authStore.model.email,
        token: pb.authStore.token,
    };
}