import { supabase } from "./supabase";
// import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

const geturl = (fileName) => {
  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
};

const upload_image = async (uid, uri, itemName) => {
  try {
    const extension = uri.split(".").pop() || "jpg";
    const sanitizedItemName = itemName.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${uid}/${sanitizedItemName}.${extension}`;

    console.log(`Starting upload for: ${fileName}, URI: ${uri}`);

    console.log(`Starting upload for: ${fileName}, URI: ${uri}`);

    // Connectivity test
    try {
        const test = await fetch("https://www.google.com", { method: "HEAD" });
        console.log(`Connectivity check: ${test.status}`);
    } catch(e) {
        console.error("Connectivity check failed:", e.message);
        throw new Error("No internet connection. Please connect to internet.");
    }

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      name: `${sanitizedItemName}.${extension}`,
      type: `image/${extension}`,
    });

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, formData, {
        contentType: `image/${extension}`,
        upsert: true,
      });

    if (error) {
        console.error("Supabase Storage Error details:", JSON.stringify(error, null, 2));
        throw error;
    }

    // console.log("File uploaded:", data);
    return geturl(`${uid}/${sanitizedItemName}.${extension}`);
  } catch (error) {
    console.error("Upload error details:", error); // Log full error object
    Alert.alert("Upload Error", error.message || "Network request failed");
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
