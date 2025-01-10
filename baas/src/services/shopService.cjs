import pb from '../config/pocketbaseConfig.cjs';
import { getItems } from './itemService.cjs';
import {updateUser} from "./userService.cjs";

const collShops = await pb.collection("shop");


export async function createShop(shopData) {
    const res = await pb.collection('shop').create(shopData);
    await updateUser(res.idUser, {"ownedShop+": res.id});
    return res;
}

export async function getAllShops(search = {}) {
    var ret = await collShops.getFullList({...{ expand: "listItem" }, ...search});
    return ret;
}

export async function editShop(shopId, changes) {
    await collShops.update(shopId, changes);
}

export async function deleteShop(shopId) {
    await collShops.delete(shopId);
}

export async function getShops(search) {
    return await pb.collection("shop").getFullList(search)
}

export async function getShopListItem(shopId) {
    return (await getItems()).filter(item => item.idShop === shopId);
}


export async function searchShops(user, maxDistance, keywords) {
    // x^2+y^2 <= d^2
    // (((uX*uX) -2uXsX + (sX*sX)) + ((uY*uY) -2uYsY + (sY*sY))) <= (d*d)
    var search = "positionX > " + (user.positionX - maxDistance) + " && "
        + "positionX < " + (user.positionX + maxDistance) + " && "
        + "positionY > " + (user.positionY - maxDistance) + " && "
        + "positionY < " + (user.positionY + maxDistance)
    for (var k in keywords) {// k est index
        search = search + ' && ( name ~ "%' + keywords[k] + '%" || description ~ "%' + keywords[k] + '%" )'
    }
    var shops
    await getShops({ filter: search }).then(data => { shops = data })
    var results = []
    const ux = user.positionX
    const uy = user.positionY
    for (var i in shops) {// i est index; raffinage
        const shop = shops[i]
        const sx = shop.positionX
        const sy = shop.positionY
        const d = Math.min(maxDistance, /*shop.dist*/maxDistance)
        const lh = ux * ux + sx * sx - (2 * ux * sx)
        const rh = uy * uy + sy * sy - (2 * uy * sy)
        const th = d * d;
        if ((lh + rh) <= th) {
            results.push(shop)
        }
    }
    return results
}



//getShopListItem("35tod674i61axrl");
//getAllShops().then(data => console.log(data))
//getAllShops({filter: 'idUser = "ru716s9j80e22g5"'}).then(data => console.log(data))
//getShopListItem("35tod674i61axrl"); //works

//lui il marche c'est le dernier que j'ai testÃ©
//getAllShops().then((data)=> console.log(data));