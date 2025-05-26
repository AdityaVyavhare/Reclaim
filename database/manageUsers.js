import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
export const addUser = async (uid, obj) => {
  try {
    await firestore().collection("users").doc(uid).set(obj);
  } catch (error) {
    console.error("Error adding document:", error);
    Alert.alert("Error", error.message);
  }
};

export const updateProfile = async (uid, obj) => {
  try {
    await firestore().collection("users").doc(uid).update(obj);
  } catch (error) {
    console.error("Error updating document:", error);
    Alert.alert("Error", error.message);
  }
};

export const getuserProfile = async (uid) => {
  try {
    const data = await firestore().collection("users").doc(uid).get();
    return data.data();
  } catch (error) {
    console.error("Error Fetching document:", error);
    Alert.alert("Error", error.message);
  }
};
