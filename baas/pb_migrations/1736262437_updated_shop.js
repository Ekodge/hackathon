/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2338794258")

  // add field
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

  // add field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_940982958",
    "hidden": false,
    "id": "relation3821080567",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "listItem",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1377172174",
    "hidden": false,
    "id": "relation2215181735",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "followers",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2338794258")

  // remove field
  collection.fields.removeById("relation4268656855")

  // remove field
  collection.fields.removeById("relation3821080567")

  // remove field
  collection.fields.removeById("relation2215181735")

  return app.save(collection)
})
