/**
 * Requires id, nickname, email, password
 * Optionally has
 * @param {*} object to check
 * @returns whether the passed object is a saveable User
 */
export function isUser(object) {
    ok = isMinimalUser(object)
    for (var arg in object) {
        if (ok) {
            ok = (arg == "id" || arg == "nickname" || arg == "email" || arg == "password" || arg == "phoneNumber"
                || arg == "positionX" || arg == "positionY" || arg == "ownedShop" || arg == "followedShop")
        }
    }
    return ok
}
/*
 * Requires id, nickname, email, password
 * @param {*} object to check
 * @returns whether the passed object is a saveable User
 */
function isMinimalUser(object) {
    return Object.hasOwn(object, "id") && Object.hasOwn(object, "nickname") && Object.hasOwn(object, "email")
        && Object.hasOwn(object, "password")
}

export function isUserDelta(object) {
    for (var arg in object) {
        if (ok) {
            ok = (arg == "id" || arg == "nickname" || arg == "email" || arg == "password" || arg == "phoneNumber"
                || arg == "positionX" || arg == "positionY" || arg == "ownedShop" || arg == "followedShop"
                || arg == "+ownedShop" || arg == "+followedShop" || arg == "ownedShop+" || arg == "followedShop+"
                || arg == "ownedShop-" || arg == "followedShop-")
        }
    }
    return ok
}

/* - XXX - */

/**
 * Requires id, name, description, positionX, positionY, address
 * Optionally has
 * @param {*} object to check
 * @returns whether the passed object is a saveable Shop
 */
export function isShop(object) {
    ok = isMinimalShop(object)
    for (var arg in object) {
        if (ok) {
            ok = (arg == "id" || arg == "name" || arg == "description"
                || arg == "positionX" || arg == "positionY" || arg == "address" || arg == "lastUpdated"
                || arg == "images" || arg == "idUser" || arg == "listItem" || arg == "followers")
        }
    }
    return ok
}
/*
 * Requires id, name, description, positionX, positionY, address
 * @param {*} object to check
 * @returns whether the passed object is a saveable Shop
 */
function isMinimalShop(object) {
    return Object.hasOwn(object, "id") && Object.hasOwn(object, "name") && Object.hasOwn(object, "description")
        && Object.hasOwn(object, "positionX") && Object.hasOwn(object, "positionY") && Object.hasOwn(object, "address")
}

export function isShopDelta(object) {
    for (var arg in object) {
        if (ok) {
            ok = (arg == "id" || arg == "name" || arg == "description"
                || arg == "positionX" || arg == "positionY" || arg == "address" || arg == "lastUpdated"
                || arg == "images" || arg == "idUser" || arg == "listItem" || arg == "followers"
                || arg == "+listItem" || arg == "+followers" || arg == "listItem+" || arg == "followers+"
                || arg == "listItem-" || arg == "followers-")
        }
    }
    return ok
}

/* - XXX - */

/**
 * Requires id, name, quantity, price, endDate
 * Optionally has
 * @param {*} object to check
 * @returns whether the passed object is a saveable Item
 */
export function isItem(object) {
    ok = isMinimalItem(object)
    for (var arg in object) {
        if (ok) {
            ok = (arg == "id" || arg == "name" || arg == "quantity" || arg == "price" || arg == "endDate"
                || arg == "images" || arg == "idShop")
        }
    }
    return ok
}
/*
 * Requires id, name, quantity, price, endDate
 * @param {*} object to check
 * @returns whether the passed object is a saveable Item
 */
function isMinimalItem(object) {
    return Object.hasOwn(object, "id") && Object.hasOwn(object, "name") && Object.hasOwn(object, "quantity")
        && Object.hasOwn(object, "price") && Object.hasOwn(object, "endDate")
}

export function isItemDelta(object) {
    for (var arg in object) {
        if (ok) {
            ok = (arg == "id" || arg == "name" || arg == "quantity" || arg == "price" || arg == "endDate"
                || arg == "images" || arg == "idShop")
        }
    }
    return ok
}