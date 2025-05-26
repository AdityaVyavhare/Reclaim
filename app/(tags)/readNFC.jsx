import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router"; // Added router import
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
  Linking,
} from "react-native";
import ReadNFC from "@/utils/readNFC";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function NFCReader() {
  const router = useRouter(); // Added router hook
  const [nfcData, setNfcData] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [scanning]);

  const parseItemId = (url) => {
    try {
      // More flexible URL parsing
      const parsedUrl = new URL(url);
      return (
        parsedUrl.searchParams.get("itemId") ||
        parsedUrl.pathname.split("/").pop() ||
        url
      );
    } catch (error) {
      console.error("URL parsing error:", error);
      return url;
    }
  };
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const readNfcTag = async () => {
    setScanning(true);
    setScanCount((prevCount) => prevCount + 1);

    try {
      const text = await ReadNFC();
      console.log("NFC Tag Data:", text);

      if (text) {
        // setNfcData(text);

        if (isValidURL(text)) {
          if (
            text.startsWith("https://reclaimmm.netlify.app/redirect?itemId")
          ) {
            const itemId = parseItemId(text);

            router.push({
              pathname: "ItemDetails",
              params: { itemId },
            });
          } else {
            Linking.openURL(text);
          }
        }
      } else {
        Alert.alert("No Data", "No readable data found on NFC tag");
        setNfcData("No data found on NFC tag");
      }
    } catch (error) {
      console.error("NFC Read Error:", error);
      Alert.alert("Error", `Failed to read NFC tag: ${error.message}`);
    } finally {
      setScanning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>NFC Reader</Text>
        {/* <View style={styles.divider} /> */}
      </View>

      {/* NFC Animation Area */}
      <View style={styles.scannerArea}>
        <Animated.View
          style={[
            styles.nfcRingOuter,
            {
              transform: [{ scale: pulseAnim }],
              opacity: scanning ? 0.8 : 0.5,
            },
          ]}
        >
          <View style={styles.nfcRingMiddle}>
            <View style={styles.nfcRingInner}>
              {scanning ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.nfcIcon}>NFC</Text>
              )}
            </View>
          </View>
        </Animated.View>

        <Text style={styles.scanStatus}>
          {scanning ? "Searching for NFC tags..." : "Ready to scan"}
        </Text>
      </View>

      {/* Instructions Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How to scan an NFC tag:</Text>
        <View style={styles.instructionRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.instructionText}>
            Press the "Scan NFC Tag" button below
          </Text>
        </View>
        <View style={styles.instructionRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.instructionText}>
            Hold your device near the NFC tag
          </Text>
        </View>
        <View style={styles.instructionRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.instructionText}>
            Keep the device steady until scan completes
          </Text>
        </View>
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={readNfcTag}
        disabled={scanning}
      >
        <Button
          mode="contained"
          icon={() => (
            <MaterialCommunityIcons name="nfc" size={24} color="white" />
          )}
        >
          {scanning ? "Scanning..." : "Scan NFC Tag"}
        </Button>
      </TouchableOpacity>

      {/* Results Section */}
      {nfcData && (
        <View style={styles.dataContainer}>
          <View style={styles.dataHeader}>
            <Text style={styles.dataHeaderText}>Tag Data</Text>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>Scan #{scanCount}</Text>
            </View>
          </View>

          <View style={styles.dataDivider} />

          <Text style={styles.nfcData}>{nfcData}</Text>

          <View style={styles.dataFooter}>
            <Text style={styles.timestampText}>
              {new Date().toLocaleTimeString()}
            </Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Hold the back of your device against the NFC tag for best results
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    paddingTop: 25,

    fontWeight: "bold",
    color: "#4F378B",
    letterSpacing: 0.5,
  },
  // divider: {
  //   marginTop: 8,
  //   width: 40,
  //   height: 3,
  //   backgroundColor: "#6A0DAD",
  //   borderRadius: 1.5,
  // },
  scannerArea: {
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    marginVertical: 15,
  },
  nfcRingOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(88, 65, 146, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  nfcRingMiddle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(88, 65, 146, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  nfcRingInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4F378B",
    alignItems: "center",
    justifyContent: "center",
  },
  nfcIcon: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  scanStatus: {
    marginTop: 16,
    fontSize: 16,
    color: "#4F378B",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#F8F6FF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#6A0DAD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F378B",
    marginBottom: 12,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4F378B",
    marginRight: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
    flex: 1,
  },
  button: {
    backgroundColor: "#4F378B",
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#6A0DAD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "rgba(88, 65, 146, 0.6)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dataContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(88, 65, 146, 0.2)",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#6A0DAD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dataHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  dataHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6A0DAD",
  },
  tagBadge: {
    backgroundColor: "rgba(88, 65, 146, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagBadgeText: {
    fontSize: 12,
    color: "#6A0DAD",
    fontWeight: "500",
  },
  dataDivider: {
    height: 1,
    backgroundColor: "rgba(88, 65, 146, 0.1)",
    marginBottom: 12,
  },
  nfcData: {
    fontSize: 15,
    color: "#333333",
    paddingHorizontal: 16,
    paddingBottom: 12,
    lineHeight: 22,
  },
  dataFooter: {
    backgroundColor: "rgba(88, 65, 146, 0.05)",
    padding: 8,
    alignItems: "flex-end",
  },
  timestampText: {
    fontSize: 12,
    color: "#666666",
  },
  footer: {
    padding: 16,
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 13,
    color: "#777777",
    textAlign: "center",
  },
});
