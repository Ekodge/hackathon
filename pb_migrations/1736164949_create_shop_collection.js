/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // Create 'shop' collection without listRule and viewRule
    let shopCollection = new Collection({
        type: "base", // Regular collection type (non-auth).
        name: "shop", // The name of the collection is 'shop'.
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
                type: "float",
                name: "positionX",
                required: true,
            },
            {
                type: "float",
                name: "positionY",
                required: true,
            },
            {
                type: "text",
                name: "address",
                required: true,
            },
            {
                type: "timestamp",
                name: "lastUpdated",
                required: false,
            },
            {
                type: "list",
                name: "images",
                required: false,
            },
            {
                type: "relation",
                name: "listItem",
                options: {
                    collectionId: "items",
                    maxSelect: null,
                }
            },
            {
                type: "relation",
                name: "listUser",
                options: {
                    collectionId: "user",
                    maxSelect: null,
                }
            },
            {
                type: "relation",
                name: "idUser",
                options: {
                    collectionId: "user",
                    maxSelect: 1,
                }
            }
        ]
    });

    // Save the shop collection to PocketBase
    app.save(shopCollection);

}, (app) => {
    // Rollback the migration (delete the 'shop' collection)
    let shopCollection = app.findCollectionByNameOrId("shop");
    app.delete(shopCollection);
});
