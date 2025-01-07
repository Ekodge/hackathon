/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // Create 'user' collection as an auth-based collection
    let userCollection = new Collection({
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
                type: "number",
                name: "positionX",
                required: false,
            },
            {
                type: "number",
                name: "positionY",
                required: false,
            }
        ],
        passwordAuth: {
            enabled: true, // Enable password-based authentication.
        },
        otp: {
            enabled: false, // OTP authentication is disabled.
        },
    });

    app.save(userCollection); // Save the 'user' collection

    // Create 'item' collection
    let itemCollection = new Collection({
        type: "base", // Regular collection type (non-auth).
        name: "item", // The name of the collection is 'item'.
        fields: [
            {
                type: "text",
                name: "name",
                required: true,
                max: 100,
            },
            {
                type: "number",
                name: "quantity",
                required: true,
            },
            {
                type: "number",
                name: "price",
                required: true,
            },
            {
                type: "date",
                name: "endDate",
                required: true,
            },
            {
                type: "file",
                name: "images",
                required: false,
                options: {
                    maxSelect: 10, // Max number of files allowed
                    maxSize: 10485760, // Max size in bytes (10 MB)
                    allowedMimeTypes: ["image/png", "image/jpeg"], // Allowed file types
                }
            }
        ]
    });

    app.save(itemCollection); // Save the 'item' collection

    // Create 'shop' collection
    let shopCollection = new Collection({
        type: "base",
        name: "shop",
        fields: [
            {
                type: "text",
                name: "name",
                required: true,
                max: 100,
            },
            {
                type: "text",
                name: "description",
                required: true,
                max: 255,
            },
            {
                type: "number",
                name: "positionX",
                required: true,
            },
            {
                type: "number",
                name: "positionY",
                required: true,
            },
            {
                type: "text",
                name: "address",
                required: true,
            },
            {
                type: "autodate",
                name: "lastUpdated",
                required: false,
                onCreate: true,
                onUpdate: true,
            },
            {
                type: "file",
                name: "images",
                required: false,
                options: {
                    maxSelect: 10, // Max number of files allowed
                    maxSize: 10485760, // Max size in bytes (10 MB)
                    allowedMimeTypes: ["image/png", "image/jpeg"], // Allowed file types
                },
            },
        ],
    });

    app.save(shopCollection); // Save the 'shop' collection

}, (app) => {
    // Rollback: delete the collections
    let userCollection = app.findCollectionByNameOrId("user");
    app.delete(userCollection);

    let itemCollection = app.findCollectionByNameOrId("item");
    app.delete(itemCollection);

    let shopCollection = app.findCollectionByNameOrId("shop");
    app.delete(shopCollection);
});
