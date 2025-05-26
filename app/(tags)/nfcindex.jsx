import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { StyleSheet } from "react-native";
import { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function NFCIndex() {
  const router = useRouter();
  const navigation = useNavigation();

  const readFromNFC = () => {
    console.log("done function to read from nfc tag");
    router.push("/readNFC");
  };
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>NFC Scanner</Text>
        {/* <View style={styles.divider} /> */}
      </View>

      {/* NFC Animation/Illustration */}
      <View style={styles.nfcIllustration}>
        <View style={styles.nfcCircleOuter}>
          <View style={styles.nfcCircleMiddle}>
            <View style={styles.nfcCircleInner}>
              <View style={styles.nfcIcon} />
            </View>
          </View>
        </View>
      </View>

      {/* Instructions Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How to use:</Text>
        <View style={styles.instructionRow}>
          <View style={styles.instructionNumber}>
            <Text style={styles.numberText}>1</Text>
          </View>
          <Text style={styles.instructionText}>
            Press "Read NFC Tag" button below
          </Text>
        </View>
        <View style={styles.instructionRow}>
          <View style={styles.instructionNumber}>
            <Text style={styles.numberText}>2</Text>
          </View>
          <Text style={styles.instructionText}>
            Hold your device near the NFC tag
          </Text>
        </View>
        <View style={styles.instructionRow}>
          <View style={styles.instructionNumber}>
            <Text style={styles.numberText}>3</Text>
          </View>
          <Text style={styles.instructionText}>Wait for scan to complete</Text>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={readFromNFC}>
          <Button
            icon={() => (
              <MaterialCommunityIcons name="nfc" size={24} color="white" />
            )}
            mode="contained"
          >
            Read NFC Tag
          </Button>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/")}
        >
          <Button mode="contained" icon={"qrcode-scan"}>
            Scan QR
          </Button>
        </TouchableOpacity>
      </View>

      {/* Footer Tip */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For best results, hold the back of your device directly against the
          NFC tag
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingBottom: 120,
  },
  header: {
    paddingTop: 25,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F378B",
    letterSpacing: 0.5,
  },
  // divider: {
  //   marginTop: 15,
  //   width: 50,
  //   height: 4,
  //   backgroundColor: "#6A0DAD",
  //   borderRadius: 2,
  // },
  nfcIllustration: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginVertical: 20,
  },
  nfcCircleOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(88, 65, 146, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  nfcCircleMiddle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(88, 65, 146, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  nfcCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(88, 65, 146, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  nfcIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F378B",
  },
  card: {
    backgroundColor: "#F8F7FF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#6A0DAD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444444",
    marginBottom: 16,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4F378B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  numberText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  instructionText: {
    fontSize: 12,
    color: "#444444",
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },

  // button: {
  //   backgroundColor: "#4F378B",
  //   paddingVertical: 10,
  //   borderRadius: 12,
  //   marginBottom: 16,
  //   shadowColor: "#6A0DAD",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 8,
  //   elevation: 6,
  //   paddingInline: 10,
  // },
  // secondaryButton: {
  //   backgroundColor: "rgba(106, 13, 173, 0.85)",
  // },
  // buttonContent: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   gap: 0,
  // },
  // iconCircle: {
  //   width: 28,
  //   height: 28,
  //   borderRadius: 14,
  //   backgroundColor: "rgba(255, 255, 255, 0.25)",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginRight: 12,
  // },
  // nfcMiniIcon: {
  //   width: 14,
  //   height: 14,
  //   borderRadius: 7,
  //   backgroundColor: "#FFFFFF",
  // },
  // qrMiniIcon: {
  //   width: 12,
  //   height: 12,
  //   backgroundColor: "#FFFFFF",
  // },
  // buttonText: {
  //   fontSize: 18,
  //   fontWeight: "600",
  //   color: "#FFFFFF",
  // },
  footer: {
    paddingBottom: 20,
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    maxWidth: "80%",
  },
});
