import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import upload_image, { deleteOldImage } from "@/utils/upload_image";
import { useDispatch, useSelector } from "react-redux";
import { addItem_db, updateItem_db } from "@/database/manageItems";
import { serverTimestamp } from "@react-native-firebase/firestore";
import { encryptStrings } from "@/utils/encrypt";
import { addItem, updateItem } from "@/store/itemsSlice";
import Loading from "@/components/Loading";
import getCurrentLocation from "@/utils/getCurrentLocaton";

export default function FileUploadForm() {
  const uid = useSelector((state) => state.user?.user?.uid);
  const { itemm, isUpdate } = useLocalSearchParams();
  const item = itemm ? JSON.parse(itemm) : null;
  const update = isUpdate === "true";
  const dispatch = useDispatch();
  const router = useRouter();

  const [itemName, setitemName] = useState(item?.itemName || "");
  const [itemCategory, SetitemCategory] = useState(item?.itemCategory || "");
  const [itemDescription, setitemDescription] = useState(
    item?.itemDescription || ""
  );
  const [selectedFile, setSelectedFile] = useState(item?.imageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemReward, setItemRewards] = useState(item?.itemReward || 0);

  const pickFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your media library to upload an image."
      );
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err);
    }
  };



  const generateQR = async () => {
    try {
      if (
        itemName &&
        selectedFile &&
        itemCategory &&
        itemDescription &&
        itemReward
      ) {
        setIsLoading(true);
        const imageUrl = await upload_image(uid, selectedFile, itemName);
        console.log("FIX_APPLIED_CHECK: Uploaded URL:", imageUrl);
        
        if (!imageUrl) {
            console.log("FIX_APPLIED_CHECK: Aborting generation due to upload failure");
            Alert.alert("Upload Failed", "Could not upload image. Please check your connection.");
            setIsLoading(false);
            return;
        }

        let locationData = { latitude: 0, longitude: 0 };
        try {
            const loc = await getCurrentLocation();
            if (loc) locationData = { latitude: loc.latitude, longitude: loc.longitude };
        } catch (e) {
            console.log("Location error, using default", e);
        }

        const initial = {
          itemName,
          itemCategory,
          itemDescription,
          imageUrl,
          lastLocation: locationData,
          itemReward,
        };
        const iid = await addItem_db(uid, "registeredItems", {
          ...initial,
          dateRegistered: serverTimestamp(),
        });
        
        if (!iid) throw new Error("Failed to save item to database");

        const data = {
          ...initial,
          iid,
          dateRegistered: new Date(Date.now()).toISOString(),
        };
        console.log(data);
        dispatch(addItem({ collection_name: "registeredItems", data }));
        setIsLoading(false);
        const itemId = encryptStrings(uid, iid);
        router.replace({
          pathname: "/QR",
          params: { itemId },
        });
      } else {
        Alert.alert("Error", "Please fill all fields and upload image.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHandler = async () => {
    try {
      if (
        itemName &&
        selectedFile &&
        itemCategory &&
        itemDescription &&
        itemReward
      ) {
        setIsLoading(true);
        let imageUrl = selectedFile;
        if (selectedFile.startsWith("file://")) {
          await deleteOldImage(item.imageUrl);
          const uploadedUrl = await upload_image(uid, selectedFile, itemName);
          if (uploadedUrl) imageUrl = uploadedUrl;
          else throw new Error("Image upload failed");
        }
        
        let locationData = { latitude: 0, longitude: 0 };
        try {
             // Only try to update location if we can get it, otherwise keep old or use 0,0
            const loc = await getCurrentLocation();
             if (loc) locationData = { latitude: loc.latitude, longitude: loc.longitude };
             else if (item.lastLocation) locationData = item.lastLocation;
        } catch (e) {
            console.log("Location error during update, using previous or default", e);
             if (item.lastLocation) locationData = item.lastLocation;
        }

        const initial = {
          itemName,
          itemCategory,
          itemDescription,
          imageUrl,
          lastLocation: locationData,
          itemReward,
        };
        const iid = item.iid;

        const data = { ...initial, dateRegistered: serverTimestamp() };
        dispatch(
          updateItem({
            collection_name: "registeredItems",
            data: {
              ...data,
              dateRegistered: new Date(Date.now()).toISOString(),
            },
            iid,
          })
        );
        await updateItem_db(uid, "registeredItems", iid, data);
        setIsLoading(false);
        router.back();
      } else {
        Alert.alert("Error", "Please fill all fields and upload image.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!update) {
      setitemName("");
      SetitemCategory("");
      setitemDescription("");
      setSelectedFile(null);
      setItemRewards(0);
    }
  }, []);

  const content = isLoading ? (
    <Loading
      size="large"
      isLoading={isLoading}
      title={update ? "Updating Item Details" : "Generating QR Code"}
    />
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{update ? "Update" : "Add"} Item Details</Text>

        {/* IMAGE PICKER */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickFile}>
          {selectedFile ? (
            <Image source={{ uri: selectedFile }} style={styles.image} />
          ) : (
            <Text variant="bodyMedium" style={{ color: "#555" }}>
              Tap to upload image
            </Text>
          )}
        </TouchableOpacity>

        <TextInput
          label="Item Name"
          value={itemName}
          onChangeText={setitemName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Item Category"
          value={itemCategory}
          onChangeText={SetitemCategory}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Item Reward"
          value={itemReward.toString()}
          onChangeText={(val) => setItemRewards(val)}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={5}
        />
        <TextInput
          label="Item Description"
          value={itemDescription}
          onChangeText={setitemDescription}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
        />

        <Button
          onPress={update ? updateHandler : generateQR}
          style={styles.submitBtn}
          mode="contained"
          icon={update ? "update" : "qrcode-scan"}
        >
          {update ? "Update Item Details" : "Generate QR"}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },

  title: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 16,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 265,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
    aspectRatio: 4 / 3,
    width: "100%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  input: {
    marginBottom: 12,
  },
  submitBtn: {
    marginTop: 12,
    borderRadius: 10,
    padding: 5,
  },
});
