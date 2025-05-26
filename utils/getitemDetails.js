import { getuserProfile } from "@/database/manageUsers";
import { decryptStrings } from "./encrypt";
import { getItem_db, updateItem_db, addItem_db } from "@/database/manageItems";
import getCurrentLocation from "./getCurrentLocaton";
import sendPushNotification from "./sendPushNotification";
import { serverTimestamp } from "@react-native-firebase/firestore";
const getitemDetails = async (itemId, user) => {
  try {
    const [owner_uid, owner_item_iid] = decryptStrings(itemId);
    const { latitude, longitude } = await getCurrentLocation();
    await updateItem_db(owner_uid, "registeredItems", owner_item_iid, {
      lastLocation: {
        latitude,
        longitude,
      },
    });
    const userDetails = await getuserProfile(owner_uid);
    const itemDetails = await getItem_db(
      owner_uid,
      "registeredItems",
      owner_item_iid
    );

    const expotoken = userDetails.expotoken;
    const data = {
      imageUrl: itemDetails.imageUrl,
      itemName: itemDetails.itemName,
      scannedBy: user.displayName,
      lastLocation: { latitude, longitude },
      contact: user.phoneNumber,
    };
    sendPushNotification(expotoken, data);
    addItem_db(owner_uid, "updates", {
      ...data,
      time: serverTimestamp(),
    });
    return [userDetails, itemDetails];
  } catch (err) {
    console.log(err);
    console.log(err.message);
  }
};
export default getitemDetails;
