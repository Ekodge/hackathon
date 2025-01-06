// migrations/1687801100_create_user_auth_collection.js

migrate((app) => {
    // Create 'users' collection as an auth-based collection
    let collection = new Collection({
        type: "auth", // This is an auth-based collection for managing authentication.
        name: "user", // The name of the collection is 'user'.
        listRule: "id = @request.auth.id", // Users can only list their own records.
        viewRule: "id = @request.auth.id", // Users can only view their own records.
        fields: [
            {
                type: "text",
                name: "nickname",
                required: true,
                max: 100,
                listRule: "", // This makes nickname publicly accessible in queries.
                viewRule: ""
            },
            {
                type: "email",
                name: "email",
                required: true,
                listRule: "", // This makes email publicly accessible in queries.
                viewRule: ""
            },
            {
                type: "text",
                name: "phoneNumber",
                required: false,
                listRule: "", // This makes phoneNumber publicly accessible in queries.
                viewRule: ""
            },
            {
                type: "float",
                name: "positionX",
                required: false,
            },
            {
                type: "float",
                name: "positionY",
                required: false,
            },
            {
                type: "relation",
                name: "orderedShop",
                options: {
                    collectionId: "shop",
                    maxSelect: null,
                }
            },
            {
                type: "relation",
                name: "followedShop",
                options: {
                    collectionId: "shop",
                    maxSelect: null,
                }
            }
        ],
        passwordAuth: {
            enabled: true, // Enable password-based authentication.
        },
        otp: {
            enabled: false, // OTP authentication is disabled.
        },
    });

    // Save the collection to PocketBase
    app.save(collection);
}, (app) => {
    // Rollback the migration (delete the 'users' collection)
    let collection = app.findCollectionByNameOrId("user");
    app.delete(collection);
});
