/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2338794258")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number2172440823",
    "max": null,
    "min": null,
    "name": "dist",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2338794258")

  // remove field
  collection.fields.removeById("number2172440823")

  return app.save(collection)
})
