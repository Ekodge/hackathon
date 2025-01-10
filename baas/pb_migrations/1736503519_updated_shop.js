/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2338794258")

  // update field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1377172174",
    "hidden": false,
    "id": "relation4268656855",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idUser",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

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
  const collection = app.findCollectionByNameOrId("pbc_2338794258")

  // update field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1377172174",
    "hidden": false,
    "id": "relation4268656855",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idUser",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

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
