import { getuserProfile } from "@/database/manageUsers";
import { decryptStrings } from "./encrypt";
import { getItem_db, updateItem_db, addItem_db } from "@/database/manageItems";
import getCurrentLocation from "./getCurrentLocaton";
import sendPushNotification from "./sendPushNotification";
import { serverTimestamp } from "@react-native-firebase/firestore";
const getitemDetails = async (itemId, user) => {
  try {
    const [owner_uid, owner_item_iid] = decryptStrings(itemId);
    console.log("Decrypted UID:", owner_uid, "IID:", owner_item_iid);
    
    if (!owner_uid || !owner_item_iid) {
        throw new Error("Invalid scanned Code. Decryption failed.");
    }
    
    let locationData = { latitude: 0, longitude: 0 };
    try {
        const loc = await getCurrentLocation();
        if (loc) locationData = { latitude: loc.latitude, longitude: loc.longitude };
    } catch (e) {
        console.log("Location fetch failed in getitemDetails, using default");
    }

    try {
        await updateItem_db(owner_uid, "registeredItems", owner_item_iid, {
          lastLocation: locationData,
        });
    } catch(e) {
        console.error("Failed to update last location:", e);
    }

    const userDetails = await getuserProfile(owner_uid);
    if (!userDetails) throw new Error("User Profile not found for UID: " + owner_uid);

    const itemDetails = await getItem_db(
      owner_uid,
      "registeredItems",
      owner_item_iid
    );
    if (!itemDetails) throw new Error("Item details not found for IID: " + owner_item_iid);

    const expotoken = userDetails.expotoken;
    const data = {
      imageUrl: itemDetails.imageUrl,
      itemName: itemDetails.itemName,
      scannedBy: user.displayName,
      lastLocation: locationData,
      contact: user.phoneNumber,
      uid: user.uid,
    };
    sendPushNotification(expotoken, data);
    addItem_db(owner_uid, "updates", {
      ...data,
      time: serverTimestamp(),
    });
    return [userDetails, itemDetails];
  } catch (err) {
    console.log("Error in getitemDetails:", err);
    return null;
  }
};
export default getitemDetails;
