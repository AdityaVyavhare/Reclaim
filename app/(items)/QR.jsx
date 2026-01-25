import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import AntDesign from "@expo/vector-icons/AntDesign";
import ViewShot from "react-native-view-shot";
import { useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import writeNFC from "@/utils/writeNFC";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NFCAnimation from "@/components/NFCAnimation";
import reclaimLogo from "../../assets/images/reclaim.png";

export default function QR() {
  const { itemId } = useLocalSearchParams();
  const [status, setStatus] = useState("idle");
  const deepLink = `https://reclaimmm.netlify.app/redirect?itemId=${itemId}`;
  const styles = createStyles();
  let qrRef = useRef();

  const handleNFCWriting = async (deepLink) => {
    writeNFC(deepLink, setStatus); // 'idle', 'scanning', 'writing', 'success'
  };

  const saveQRCode = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need storage permission to save the QR code."
        );
        return;
      }
      qrRef.current.capture().then(async (uri) => {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("QR Codes", asset, false);
        Alert.alert("Success", "QR Code saved to gallery!");
      });
    } catch (error) {
      console.error("Error saving QR Code:", error);
      Alert.alert("Error", "Could not save QR Code.");
    }
  };

  const content =
    status === "idle" ? (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
            <View style={styles.qrContainer}>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={deepLink}
                  size={300}
                  color="black"
                  backgroundColor="white"
                  logo={reclaimLogo}
                  logoBackgroundColor="transparent"
                />

                {/* Overlay text on QR code */}
                {/* <View style={styles.overlayTextContainer}>
                  <Text style={styles.overlayText}>SCAN ME</Text>
                  <Text style={styles.overlaySubText}>
                    to report found item and earn RCoin
                  </Text>
                </View> */}
              </View>
            </View>
          </ViewShot>

          <View style={styles.btn_container}>
            <Pressable>
              <Button onPress={saveQRCode} style={styles.btn} mode="contained">
                <AntDesign size={20} name="download" color={"white"} />
                <Text> Download</Text>
              </Button>
            </Pressable>
            <Pressable>
              <Button
                onPress={() => handleNFCWriting(deepLink)}
                style={styles.btn}
                mode="contained"
                icon={() => (
                  <MaterialCommunityIcons name="nfc" size={24} color="white" />
                )}
              >
                <Text> Pair With NFC</Text>
              </Button>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    ) : (
      <NFCAnimation status={status} />
    );
  return content;
}

const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    qrContainer: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    qrWrapper: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    overlayTextContainer: {
      position: "absolute",
      top: "50%",
      left: "35%",
      transform: [{ translateX: -50 }, { translateY: -10 }],
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#4F378B",
    },
    overlayText: {
      fontSize: 16,
      fontWeight: "800",
      color: "#4F378B",
      letterSpacing: 1,
    },
    overlaySubText: {
      fontSize: 10,
      color: "#666",
      fontWeight: "900",
    },
    btn_container: {
      gap: 15,
      marginTop: 25,
      flexDirection: "row",
    },
    btn: {
      borderRadius: 10,
    },
  });
};
