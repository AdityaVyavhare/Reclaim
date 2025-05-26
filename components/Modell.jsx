import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { makeCall, makeSMS, sendEmail } from "@/utils/contact";
import { Ionicons } from "@expo/vector-icons";
import Loading from "./Loading";
import { openGoogleMaps } from "@/utils/contact";
const Modell = ({
  openDialog,
  handleCloseDialog,
  isLoading,
  itemOwnerDetails,
  itemDetails,
}) => {
  const styles = createStyles();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openDialog}
      onRequestClose={() => handleCloseDialog()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.dialog}>
          {isLoading ? (
            <Loading
              size="large"
              isLoading={isLoading}
              title="Finding Item Owner..."
            />
          ) : (
            <View>
              <Text style={styles.dialogTitle}>Item Details</Text>
              <View style={styles.profile}>
                <Image
                  style={styles.profile_picture}
                  source={{
                    uri: itemOwnerDetails?.photoURL,
                  }}
                />
                <View style={styles.profile_right}>
                  <Text style={styles.profile_name}>
                    {itemOwnerDetails?.displayName.trim()}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      itemOwnerDetails.privacy.email &&
                        sendEmail(itemOwnerDetails.email, itemDetails.itemName);
                    }}
                  >
                    <Text style={styles.profile_email}>
                      {itemOwnerDetails.privacy.email
                        ? itemOwnerDetails?.email
                        : "email hidden for privacy"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.top}>
                <Image
                  style={styles.item_image}
                  source={{
                    uri: itemDetails?.imageUrl,
                  }}
                />
                <View style={styles.info}>
                  <Text style={styles.title}>
                    {itemDetails?.itemName.trim()}
                    <Text style={styles.category}>
                      {` (${itemDetails?.itemCategory.trim()})`}
                    </Text>
                  </Text>

                  <Text style={styles.description} numberOfLines={4}>
                    {itemDetails?.itemDescription}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.actions}>
                <View style={styles.contact}>
                  <TouchableOpacity
                    onPress={() => {
                      itemOwnerDetails.privacy.phone &&
                        makeCall(itemOwnerDetails?.phoneNumber);
                    }}
                  >
                    <MaterialIcons
                      size={28}
                      name="call"
                      color={
                        itemOwnerDetails.privacy.phone
                          ? "#584192"
                          : "rgba(88, 65, 146,.25)"
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      itemOwnerDetails.privacy.phone &&
                        makeSMS(itemOwnerDetails?.phoneNumber);
                    }}
                  >
                    <Feather
                      size={28}
                      name="message-square"
                      color={
                        itemOwnerDetails.privacy.phone
                          ? "#584192"
                          : "rgba(88, 65, 146,.25)"
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      itemOwnerDetails.privacy.location &&
                        openGoogleMaps(itemOwnerDetails?.location);
                    }}
                  >
                    <Ionicons
                      size={28}
                      name="location-outline"
                      color={
                        itemOwnerDetails.privacy.location
                          ? "#584192"
                          : "rgba(88, 65, 146,.25)"
                      }
                    />
                  </TouchableOpacity>
                </View>
                <Pressable
                  onPress={() => handleCloseDialog()}
                  style={styles.closeButton}
                >
                  <Text style={styles.buttonTextOutlined}>Close</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const createStyles = () =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    dialog: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      width: "90%",
      minHeight: 350,
    },
    dialogTitle: {
      fontSize: 25,
      fontWeight: "900",
      color: "#333",
      textAlign: "center",
      marginBottom: 10,
    },
    profile: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
    },
    profile_picture: {
      height: 50,
      width: 50,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: "#584192",
      backgroundColor: "rgba(0,0,0,.1)",
    },
    profile_right: {
      flex: 1,
      gap: 5,
      padding: 5,
    },
    profile_name: {
      fontSize: 15,
      fontWeight: "700",
      color: "#000",
    },
    profile_email: {
      fontSize: 12,
      color: "#584192",
      textDecorationLine: "underline",
    },
    divider: {
      borderBottomColor: "rgba(0,0,0,0.2)",
      borderBottomWidth: 1,
      marginVertical: 10,
    },
    top: {
      flexDirection: "row",
      alignItems: "start",
      gap: 10,
      paddingVertical: 5,
    },
    item_image: {
      width: 100,
      height: 100,
      borderRadius: 10,
      backgroundColor: "rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: 15,
      fontWeight: "700",
      color: "#000",
    },
    category: {
      fontSize: 10,
      color: "#000",
      fontWeight: 500,
    },
    description: {
      fontSize: 12,
      color: "#555",
      flexShrink: 1,
      maxWidth: 170,
    },
    info: {
      gap: 3,
    },
    actions: {
      justifyContent: "space-between",
      // paddingHorizontal: 10,
      paddingBottom: 10,
      flexDirection: "row",
      marginTop: 20,
    },
    contact: {
      flexDirection: "row",
      gap: 20,
    },
    closeButton: {
      borderColor: "#584192",
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 5,
      paddingHorizontal: 15,
      alignSelf: "flex-end",
    },
    buttonTextOutlined: {
      color: "#584192",
      fontSize: 14,
      fontWeight: "600",
    },
  });
export default Modell;
