import { View, Text } from "react-native";
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
    const [item_owner_details, item_details] = await getitemDetails(
      item_id,
      user.user
    );
    setItemOwnerDetails(item_owner_details);
    setItemDetails(item_details);
    setIsLoading(false);
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
