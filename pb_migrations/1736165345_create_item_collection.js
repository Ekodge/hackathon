/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let itemCollection = new Collection({
        type: "base", // Regular collection type (non-auth).
        name: "item", // The name of the collection is 'item'.
        listRule: "true", // Allow anyone to list all items.
        viewRule: "true", // Allow anyone to view the details of any item.
        fields: [
            {
                type: "text",
                name: "name",
                required: true,
                max: 100,
            },
            {
                type: "integer",
                name: "quantity",
                required: true,
            },
            {
                type: "float",
                name: "price",
                required: true,
            },
            {
                type: "date",
                name: "endDate",
                required: true,
            },
            {
                type: "list",
                name: "images",
                required: false,
            },
            {
                type: "relation",
                name: "idShop",
                options: {
                    collectionId: "shop",
                    maxSelect: 1,
                }
            }
        ]
    });

    app.save(itemCollection); // Save the item collection to PocketBase.

}, (app) => {
    let itemCollection = app.findCollectionByNameOrId("item"); // Find the 'item' collection.
    app.delete(itemCollection); // Delete the 'item' collection if rolling back the migration.
});
