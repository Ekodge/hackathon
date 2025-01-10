/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1377172174")

  // update field
  collection.fields.addAt(12, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_749661959",
    "hidden": false,
    "id": "relation4151943774",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "listCart",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1377172174")

  // update field
  collection.fields.addAt(12, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_749661959",
    "hidden": false,
    "id": "relation4151943774",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "listCart",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
