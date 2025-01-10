/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_749661959")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1377172174",
    "hidden": false,
    "id": "relation4268656855",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idUser",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2338794258",
    "hidden": false,
    "id": "relation3751219772",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idShop",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2323366120",
    "hidden": false,
    "id": "relation4194791898",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "listCart_Entry",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_749661959")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1377172174",
    "hidden": false,
    "id": "relation4268656855",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idUser",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2338794258",
    "hidden": false,
    "id": "relation3751219772",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idShop",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2323366120",
    "hidden": false,
    "id": "relation4194791898",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "listCart_Entry",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
