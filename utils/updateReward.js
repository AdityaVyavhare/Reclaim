import { updateProfile } from "@/database/manageUsers";
import { increment } from "@react-native-firebase/firestore";
export const incrementReward = async (uid, value) => {
  try {
    await updateProfile(uid, { totalRewards: increment(value) });
  } catch (err) {
    console.log(err.message);
  }
};
export const decrementReward = async (uid, value) => {
  try {
    await updateProfile(uid, { totalRewards: increment(-1 * value) });
  } catch (err) {
    console.log(err.message);
  }
};
