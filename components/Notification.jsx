import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import getTimeAgo from "@/utils/getTimeAgo";
import { makeCall } from "@/utils/contact";
import openGoogleMaps from "@/utils/openGoogleMaps";

export default function Notification({ notification }) {
  const styles = createStyles();
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image style={styles.image} source={{ uri: notification?.imageUrl }} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{notification?.itemName}</Text>
          <Text style={styles.description}>
            last scanned by {notification?.scannedBy}
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            makeCall(notification.contact);
          }}
        >
          <Feather name="phone-call" size={20} color={"#4F378B"} />
          <Text style={styles.buttonTextOutlined}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            openGoogleMaps(
              notification.lastLocation.latitude,
              notification.lastLocation.longitude
            );
          }}
        >
          <Entypo name="location-pin" size={20} color={"#4F378B"} />
          <Text style={styles.buttonTextOutlined}>Location</Text>
        </TouchableOpacity>
        <Text style={styles.timeText}>{getTimeAgo(notification.time)}</Text>
      </View>
    </View>
  );
}

const createStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: "white",
      borderRadius: 12,
      padding: 16,
      margin: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 1,
    },
    top: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
      color: "#333",
    },
    description: {
      fontSize: 14,
      color: "#666",
      lineHeight: 20,
    },
    bottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    closeButton: {
      borderColor: "#584192",
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginRight: 10,
      display: "flex",
      flexDirection: "row",
      gap: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonTextOutlined: {
      color: "#584192",
      fontSize: 14,
      fontWeight: "600",
    },
    timeText: {
      fontSize: 12,
      color: "#999",
      fontWeight: 900,
    },
  });
};
