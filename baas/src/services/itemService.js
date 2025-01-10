import pb from '../config/pocketbaseConfig.js'; // Import your PocketBase configuration

// Create a new item
export async function createItem(itemData) {
    let newItem;
    const answer = await pb.collection('item').create(itemData).then((item) => {
        newItem = item;
    }
    );
    if(newItem == null) {
        return answer;
    }
    return await pb.collection("shop").update(itemData.idShop, {"listItem+": newItem.id}).then(() => {
            return newItem;
        }
    );
}

// Retrieve all items
export async function getItems() {
    return await pb.collection('item').getFullList();
}

// Retrieve a single item by ID
export async function getItemById(itemId) {
    return await pb.collection('item').getOne(itemId);
}

// Update item information
export async function updateItem(itemId, itemData) {
    return await pb.collection('item').update(itemId, itemData);
}

// Delete an item
export async function deleteItem(itemId) {
    return await pb.collection('item').delete(itemId);
}
