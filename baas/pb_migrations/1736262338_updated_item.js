/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_940982958")

  // add field
  collection.fields.addAt(6, new Field({
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_940982958")

  // remove field
  collection.fields.removeById("relation3751219772")

  return app.save(collection)
})
