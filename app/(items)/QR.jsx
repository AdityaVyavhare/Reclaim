import { View, StyleSheet, Pressable, Text } from "react-native";
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
      <View style={styles.container}>
        <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
          <QRCode
            style={styles.QR}
            value={deepLink}
            size={300} // Size of the QR Code
            color="black" // Foreground color
            backgroundColor="white" // Background color
            logo={reclaimLogo} // Optional logo
            //   logoSize={40} // Size of the logo
            logoBackgroundColor="transparent" // Logo background color
          />
        </ViewShot>
        {/* <Text style={styles.id}>Item Id:{itemId}</Text> */}
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
      </View>
    ) : (
      <NFCAnimation status={status} />
    );
  return content;
}

const createStyles = () => {
  return StyleSheet.create({
    container: {
      padding: 20,
      height: "100vh",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    id: {
      fontWeight: 900,
      marginTop: 20,
    },
    // btn: {
    //   borderRadius: 10,
    //   padding: 5,
    //   width: "100%",
    // },
    btn_container: {
      gap: 15,
      marginBlock: 25,
      display: "flex",
      flexDirection: "row",
    },
  });
};
