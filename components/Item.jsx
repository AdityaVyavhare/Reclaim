import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button, Surface } from "react-native-paper";
import getTimeAgo from "@/utils/getTimeAgo";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { encryptStrings } from "@/utils/encrypt";
import { deleteItem } from "@/store/itemsSlice";
import { deleteItem_db } from "@/database/manageItems";
import { deleteOldImage } from "@/utils/upload_image";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Loading from "./Loading";
import openGoogleMaps from "@/utils/openGoogleMaps";
const Item = ({ item, fetchAllItems }) => {
  const router = useRouter();
  const styles = creteStyles();
  const uid = useSelector((state) => state.user?.user?.uid);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const editHandler = () => {
    router.push({
      pathname: "/(items)/AddItem",
      params: {
        itemm: JSON.stringify(item),
        isUpdate: "true",
      },
    });
  };
  const deleteHandler = async () => {
    try {
      setIsLoading(true);
      dispatch(deleteItem("registeredItems", item.iid));
      await deleteOldImage(item.imageUrl);
      await deleteItem_db(uid, "registeredItems", item.iid);
      fetchAllItems();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      console.log(err.message);
    }
  };
  const locationHandler = () => {
    console.log(item.lastLocation);
    openGoogleMaps(item.lastLocation.latitude, item.lastLocation.longitude);
  };
  return (
    <Surface style={styles.container} elevation={0.1}>
      {isLoading ? (
        <Loading size="large" isLoading={isLoading} title={"Deleting Item"} />
      ) : (
        <View>
          <View style={styles.top}>
            <Image style={styles.item_image} source={{ uri: item.imageUrl }} />
            <View style={styles.info}>
              <View style={styles.top_container}>
                <View>
                  <Text style={styles.title}>
                    {item.itemName}
                    <Text style={styles.category}> ({item.itemCategory})</Text>
                  </Text>

                  <TouchableOpacity
                    style={styles.location}
                    onPress={locationHandler}
                  >
                    <EvilIcons
                      name="location"
                      size={20}
                      color="#4F378B"
                      height={20}
                    />
                    <Text style={styles.location_text}> Last Location</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity>
                <Button
                  onPress={() => {
                    router.push({
                      pathname: "/QR",
                      params: {
                        itemId: encryptStrings(uid, item.iid),
                      },
                    });
                  }}
                  mode="contained"
                  icon="qrcode-scan"
                >
                  View QR
                </Button>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.bottom}>
            <Text styles={styles.agoo}>{getTimeAgo(item.dateRegistered)}</Text>

            <View style={styles.update}>
              <TouchableOpacity onPress={editHandler}>
                <AntDesign size={20} name="edit" color={"black"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteHandler}>
                <AntDesign size={20} name="delete" color={"black"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Surface>
  );
};
const creteStyles = () =>
  StyleSheet.create({
    location: {
      flexDirection: "row",
      alignItems: "center",
      // backgroundColor: "red",
      justifyContent: "flex-start",
      height: 30,
      paddingBottom: 10,
    },
    location_text: {
      fontSize: 12,
      textDecorationLine: "underline",
      color: "#4F378B",
      paddingBottom: 5,
    },
    container: {
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom: 15,
      minHeight: 150,
    },
    title: { fontSize: 17, fontWeight: 900, marginBottom: 2 },
    category: { fontSize: 12, fontWeight: 500 },
    info: {
      flex: 1,
      justifyContent: "flex-start",
      paddingInline: 10,
    },
    divider: {
      borderBottomColor: "rgba(0,0,0,0.1)",
      borderBottomWidth: 1,
      marginVertical: 5,
      width: 300,
      marginInline: "auto",
    },
    top: {
      flex: 1,
      gap: 5,
      flexDirection: "row",
      padding: 10,
    },
    item_image: {
      width: 100,
      height: 100,
      borderRadius: 10,
      backgroundColor: "rgba(0,0,0,.1)",
    },
    bottom: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      paddingInline: 20,
      paddingBottom: 10,
    },
    status: {
      paddingBlock: 5,
      paddingInline: 10,
      borderRadius: 5,
      backgroundColor: "rgba(158, 219, 186, 0.5)",
    },
    agoo: {
      fontStyle: "italic",
      fontWeight: 900,
    },
    update: {
      flexDirection: "row",
      gap: 20,
    },
    top_container: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  });
export default Item;
