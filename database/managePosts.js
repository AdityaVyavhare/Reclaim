import { database } from "../firebase";
import { ref, set, push, get, update, remove } from "firebase/database";
import { Alert } from "react-native";
// ✅ Create Product (Add a new item)
export const addProductItemData = async (productData) => {
  try {
    const productRef = ref(database, "products");
    const newProductRef = push(productRef); // Generates a unique ID
    await set(newProductRef, productData);

    return { status: true, id: newProductRef.key }; // Return new ID
  } catch (error) {
    console.error("Error adding product:", error);
    Alert.alert("Error adding product", error.message);

    return { status: false, error };
  }
};

// ✅ Read All Products (Fetch all items)
export const getAllProducts = async () => {
  try {
    const productRef = ref(database, "products");
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const productList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      return { status: true, data: productList };
    } else {
      return { status: true, data: [] };
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    Alert.alert("Error fetching products", error.message);

    return { status: false, error };
  }
};

// ✅ Update Product (Modify existing item)
export const updateProduct = async (productId, updateData) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    await update(productRef, updateData);

    return { status: true };
  } catch (error) {
    console.error("Error updating product:", error);
    Alert.alert("Error updating product", error.message);

    return { status: false, error };
  }
};

// ✅ Delete Product (Remove an item)
export const deleteProduct = async (productId) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    await remove(productRef);

    return { status: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    Alert.alert("Error deleting product:", error.message);

    return { status: false, error };
  }
};
