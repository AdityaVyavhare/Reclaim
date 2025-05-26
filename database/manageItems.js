import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
export const addItem_db = async (uid, collection_name, obj) => {
  try {
    const docRef = await firestore()
      .collection("users")
      .doc(uid)
      .collection(collection_name)
      .add(obj);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    Alert.alert("Failed", error.message);
  }
};

export const updateItem_db = async (uid, collection_name, iid, obj) => {
  try {
    const temp = await firestore()
      .collection("users")
      .doc(uid)
      .collection(collection_name)
      .doc(iid)
      .update(obj);
    console.log(temp);
  } catch (error) {
    console.error("Error updating document:", error);
    Alert.alert("Failed", error.message);
  }
};

export const deleteItem_db = async (uid, collection_name, iid) => {
  try {
    await firestore()
      .collection("users")
      .doc(uid)
      .collection(collection_name)
      .doc(iid)
      .delete();
  } catch (error) {
    console.error("Error deleting document:", error);
    Alert.alert("Failed", error.message);
  }
};

export const getItem_db = async (uid, collection_name, iid) => {
  try {
    const data = await firestore()
      .collection("users")
      .doc(uid)
      .collection(collection_name)
      .doc(iid)
      .get();
    return data.data();
  } catch (error) {
    console.error("Error deleting document:", error);
    Alert.alert("Failed", error.message);
  }
};

export const getAllUsers_db = async () => {
  try {
    const usersCollection = await firestore().collection("users").get(); // Fetch all documents
    const users = usersCollection.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    Alert.alert("Failed", error.message);
  }
};

export const getAllItems_db = async (uid, collection_name) => {
  try {
    const usersCollection = await firestore()
      .collection("users")
      .doc(uid)
      .collection(collection_name)
      .get();
    const users = usersCollection.docs.map((doc) => ({
      iid: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    Alert.alert("Failed", error.message);
  }
};

export const deleteSubcollection = async (
  parentCollection,
  documentId,
  subcollectionName
) => {
  try {
    // Reference to the subcollection
    const subcollectionRef = firestore()
      .collection(parentCollection)
      .doc(documentId)
      .collection(subcollectionName);

    // Get all documents in the subcollection
    const querySnapshot = await subcollectionRef.get();

    // Create a batch to perform multiple deletes
    const batch = firestore().batch();

    // Add each document to the batch to be deleted
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();

    return true;
  } catch (error) {
    console.error("Error deleting subcollection:", error);
    Alert.alert("Failed", error.message);

    throw error;
  }
};
