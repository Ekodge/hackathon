/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2323366120")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_749661959",
    "hidden": false,
    "id": "relation2019481129",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idCart",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_940982958",
    "hidden": false,
    "id": "relation1827044224",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idItem",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2323366120")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_749661959",
    "hidden": false,
    "id": "relation2019481129",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idCart",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_940982958",
    "hidden": false,
    "id": "relation1827044224",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "idItem",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
