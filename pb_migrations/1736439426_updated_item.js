/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_940982958")

  // add field
  collection.fields.addAt(7, new Field({
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_940982958")

  // remove field
  collection.fields.removeById("relation4194791898")

  return app.save(collection)
})
