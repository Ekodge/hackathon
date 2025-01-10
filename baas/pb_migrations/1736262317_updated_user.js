/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1377172174")

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2338794258",
    "hidden": false,
    "id": "relation22578702",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "ownedShop",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2338794258",
    "hidden": false,
    "id": "relation931779681",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "followedShop",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1377172174")

  // remove field
  collection.fields.removeById("relation22578702")

  // remove field
  collection.fields.removeById("relation931779681")

  return app.save(collection)
})
