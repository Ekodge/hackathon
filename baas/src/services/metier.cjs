import { addItem, addShop, addUser, changeItem, changeShop, changeUser, getItem, getShop, getShops, getUser } from "./db_tmp.cjs"

// > METIER
// Search shops
// follow a shop ---> unfollow
// get shop link ---> le front
// book an item
// recuperer infos de reservation

// panier -> user, shop, list<item>






//followShop({id: "6joi0zqqw25sb27"}, {id:"7dk829b6z62d419"})
//unfollowShop({ id: "6joi0zqqw25sb27" }, { id: "7dk829b6z62d419" })

//getItem("874z8oi2qa9ew9n").then((data) => console.log(data))

//getShop().then((data)=>console.log(data))
searchShops({positionX: 540, positionY: 4220}, 50, ["x"]).then((data) => console.log(data))
//searchShops({positionX: 540, positionY: 4820}, 50, ["x"]).then((data) => console.log(data))
//searchShops({positionX: 540, positionY: 4220}, 50, ["x", "y"]).then((data) => console.log(data))






export async function searchShops(user, maxDistance, keywords) {
    var search = "positionX > " + (user.positionX - maxDistance) + " && "
        + "positionX < " + (user.positionX + maxDistance) + " && "
        + "positionY > " + (user.positionY - maxDistance) + " && "
        + "positionY < " + (user.positionY + maxDistance)
    for (var k in keywords) {// k est index
        search = search + ' && ( name ~ "%'+keywords[k]+'%" || description ~ "%'+keywords[k]+'%" )'
    }
        //search = search + ' && ( name ~ "%'+w+'%" || description ~ "%'+w+'%" )'
    
console.log(">>>>> "+ search)

    return getShops({filter: search})
    //for verif si a distance (maniere affinée)
}

export function followShop(user, shop) {
    changeShop(shop.id, { "followers+": user.id })
    changeUser(user.id, { "followedShop+": shop.id })
}
export function unfollowShop(user, shop) {
    changeShop(shop.id, { "followers-": user.id })
    changeUser(user.id, { "followedShop-": shop.id })
}

export function bookItem(user, item, quantity) {

}

export function getItemReservations(shop) {
    //voir avec panier
}