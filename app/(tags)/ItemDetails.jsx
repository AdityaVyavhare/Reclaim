import { View, Text, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Modell from "@/components/Modell";
import getitemDetails from "@/utils/getitemDetails";
import { useSelector } from "react-redux";

export default function ItemDetails() {
  const navigation = useNavigation();
  const { itemId } = useLocalSearchParams();
  const [itemOwnerDetails, setItemOwnerDetails] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const handleCloseDialog = () => {
    router.replace("/");
  };
  const fetchItemDetails = async (item_id) => {
    setOpenDialog(true);
    try {
      const result = await getitemDetails(item_id, user.user);
      if (result && Array.isArray(result) && result.length === 2) {
        setItemOwnerDetails(result[0]);
        setItemDetails(result[1]);
      } else {
         console.error("Invalid result from getitemDetails:", result);
         Alert.alert("Error", "Could not fetch item details. Please try again.");
         router.replace("/");
      }
    } catch (error) {
       console.error("Error fetching item details:", error);
       Alert.alert("Error", "An unexpected error occurred.");
       router.replace("/");
    } finally {
        setIsLoading(false);
    }
  };
  useEffect(() => {
    itemId && fetchItemDetails(itemId);
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <Modell
      openDialog={openDialog}
      handleCloseDialog={handleCloseDialog}
      isLoading={isLoading}
      itemOwnerDetails={itemOwnerDetails}
      itemDetails={itemDetails}
    />
  );
}
