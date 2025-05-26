import { supabase } from "./supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer"; // Convert base64 to binary
import { Alert } from "react-native";
const geturl = (fileName) => {
  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
};

const upload_image = async (uid, uri, itemName) => {
  try {
    const extension = uri.split(".").pop() || "jpg";
    const fileName = `${uid}/${itemName}.${extension}`;

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileData = decode(base64);

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, fileData, {
        contentType: `image/${extension}`,
      });

    if (error) throw error;

    // console.log("File uploaded:", data);
    return geturl(`${uid}/${itemName}.${extension}`);
  } catch (error) {
    console.error("Upload error:", error);
    Alert.alert("Upload Error", error.message);
  }
};

export const deleteOldImage = async (path) => {
  console.log("path:", path);
  const { error } = await supabase.storage.from("images").remove([path]);

  if (error) {
    console.log("Error deleting old image:", error.message);
  } else {
    console.log("Old image deleted successfully");
  }
};

export default upload_image;
