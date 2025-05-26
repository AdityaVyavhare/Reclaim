import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Text, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "@/store/postSlice";
import { addProductItemData } from "@/database/managePosts";
import { useRouter } from "expo-router";
import upload_image from "@/utils/upload_image";
import Loading from "./Loading";
const CreatePostForm = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState(null);
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your media library to upload an image."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (itemName && description && location && dateLost && image) {
      setIsLoading(true);
      const imagee = await upload_image(user.id, image, itemName);
      const data = {
        itemName,
        description,
        location,
        dateLost,
        image: imagee,
        uid: user.uid,
      };
      dispatch(addPost(data));
      await addProductItemData(data);
      setItemName("");
      setDescription("");
      setLocation("");
      setDateLost("");
      setImage(null);
      setIsLoading(false);
      router.replace("/");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, height: 550 }}>
        <Loading
          size="large"
          isLoading={isLoading}
          title="Posting Your Lost Item...!"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Item Name"
        mode="outlined"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TextInput
        label="Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={3}
      />
      <TextInput
        label="Last Seen Location"
        mode="outlined"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <TextInput
        label="Date Lost (e.g., 2025-03-20)"
        mode="outlined"
        value={dateLost}
        onChangeText={setDateLost}
        style={styles.input}
      />

      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text variant="bodyMedium" style={{ color: "#555" }}>
            Tap to upload image
          </Text>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 12 }}>
        Create Post
      </Button>
    </View>
  );
};

export default CreatePostForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  input: {
    marginBottom: 12,
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
    aspectRatio: "4/3",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
