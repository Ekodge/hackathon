import PocketBase from "pocketbase";
import pb from '../config/pocketbaseConfig.cjs'; // Import your PocketBase configuration

const coll = await pb.collection("item");

//test(null)

export default async function test(filterString) {
    var res = null
    //id name quantity price endDate idShop images
    if (filterString === null) {

        res = await coll.getList(1, 20);
    } else {
        res = await coll.getList(1, 20, { filter: filterString });
    }
    //console.log(res)

    coll.create({ "name": "yes", "quantity": 7 });
    return res
}




// > CRUD (bdd ?)
// create/modif an user
// create/modif a shop
// create/modif an item

/**
 * Return id
 * @param {*} object 
 */
export function addUser(object) {}
/**
 * Return id
 * @param {*} object 
 */
export function addShop(object) {}
/**
 * Return id
 * @param {*} object 
 */
export function addItem(object) {}
export async function changeUser(id, changes) {
    await pb.collection("user").update(id, changes)
}
export async function changeShop(id, changes) {
    await pb.collection("shop").update(id, changes)
}
export function changeItem(id) {}
/**
 * return object
 */
export function getUser() {}
/**
 * return object
 */
export async function getShop() {
    return await pb.collection("shop")./*getOne("431m87szwrmyhvk")*/getFullList()
}
/**
 * return object
 */
export async function getItem(id) {
    return await coll.getOne(id)
}

/**
 * return array of objects
 * doesn't return mathematically impossible shops from user's dist
 */
export async function getShops(search) {
    return await pb.collection("shop").getFullList(search)
}