import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
const APP_NAME = "Reclaim";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Function to check if string is a valid URL
const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState("");
  const [scannerActive, setScannerActive] = useState(true);
  const [errorVisible, setErrorVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  // Start scan line animation when scanner is active
  useEffect(() => {
    if (scannerActive && !scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanLineAnimation.setValue(0);
    }
  }, [scannerActive, scanned]);

  // Handle error message animation
  useEffect(() => {
    if (errorVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setErrorVisible(false);
      });
    }
  }, [errorVisible]);

  const showErrorMessage = () => {
    setErrorVisible(true);
    console.log("Not now pressed");
  };

  // Function to handle opening URLs
  const openURL = async (url) => {
    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        console.error("Error opening URL:", error);
        Alert.alert("Error", "Could not open the URL: " + error.message);
      }
    } else {
      Alert.alert("Error", "Cannot open this URL");
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Permission screen code remains the same
    return (
      <SafeAreaView style={styles.permissionContainer}>
        {/* Permission UI code unchanged */}
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{APP_NAME}</Text>
          <Text style={styles.headerSubtitle}>Camera Access Required</Text>
        </View> */}

        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons name="camera" size={60} color="#6A0DAD" />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>Camera Permission Required</Text>

          <Text style={styles.descriptionText}>
            {APP_NAME} requires camera access to scan barcodes and capture
            photos. Your privacy is important to us - we only use the camera
            when you activate it.
          </Text>

          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot}></View>
              <Text style={styles.featureText}>
                Capture high-quality photos
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureDot}></View>
              <Text style={styles.featureText}>
                Switch between front and back cameras
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureDot}></View>
              <Text style={styles.featureText}>Scan barcodes and QR codes</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureDot}></View>
              <Text style={styles.featureText}>
                Access camera controls and settings
              </Text>
            </View>
          </View>
        </View>

        {errorVisible && (
          <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
            <Ionicons
              name="alert-circle"
              size={20}
              color="#FFFFFF"
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>
              Camera permission is required to use this feature
            </Text>
          </Animated.View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={showErrorMessage}
          >
            <Button>Not Now</Button>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={requestPermission}
          >
            <Button icon={"camera"} mode="contained">
              Grant Access
            </Button>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              console.log("change to scanning nfc mode");
              router.push("/nfcindex");
            }}
          >
            <Button
              icon={() => (
                <MaterialCommunityIcons name="nfc" size={24} color="white" />
              )}
              mode="contained"
            >
              Scan for NFC Tag
            </Button>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Camera view (once permission is granted)
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleScannerMode() {
    setScannerActive((current) => !current);
    if (scanned) setScanned(false);
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;

    setScanned(true);
    setBarcodeData(data);

    // Check if the scanned data is a URL
    setTimeout(() => {
      setScanned(false);
    }, 1000);
    if (isValidURL(data)) {
      if (data.startsWith("https://reclaimmm.netlify.app/redirect?itemId")) {
        setScanned(false);
        setScannerActive(true);
        router.push({
          pathname: "ItemDetails",
          params: {
            itemId: data.split("=")[1],
          },
        });
      } else {
        Linking.openURL(data);
      }
    } else {
      Alert.alert("Barcode Detected", `Type: ${type}\nData: ${data}`, [
        {
          text: "Scan Again",
          onPress: () => setScanned(false),
        },
      ]);
    }
  };

  const scanLineTranslate = scanLineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-125, 125],
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "pdf417",
            "ean13",
            "ean8",
            "code128",
            "code39",
            "code93",
            "datamatrix",
            "aztec",
            "itf14",
            "upc_e",
          ],
          interval: 500, // Scan every 500ms
        }}
        onBarcodeScanned={
          scannerActive && !scanned ? handleBarCodeScanned : undefined
        }
      >
        <View style={styles.headerBar}>
          <Text style={styles.appNameText}>{APP_NAME}</Text>
          <Text style={styles.modeText}>
            {scannerActive ? "Barcode Scanner" : "Camera Mode"}
          </Text>
        </View>

        {scannerActive && (
          <View style={styles.scannerOverlay}>
            <View style={styles.darkOverlay} />
            <View style={styles.scannerFrameContainer}>
              <View style={styles.scannerFrame}>
                {!scanned && (
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        transform: [{ translateY: scanLineTranslate }],
                      },
                    ]}
                  />
                )}
              </View>
              <Text style={styles.instructionText}>
                {scanned ? "Barcode Detected" : "Position barcode in frame"}
              </Text>
            </View>
            <View style={styles.darkOverlay} />
          </View>
        )}

        <View style={styles.cameraButtonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Button
              icon={() => (
                <Ionicons
                  name="camera-reverse"
                  size={20}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
              )}
            >
              <Text style={styles.flipButtonText}>Flip</Text>
            </Button>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.scanButton,
              scannerActive ? styles.activeButton : {},
            ]}
            onPress={toggleScannerMode}
          >
            <Ionicons
              name="barcode"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.flipButtonText}>
              {scannerActive ? "Scanner On" : "Scanner Off"}
            </Text>
          </TouchableOpacity>
        </View>

        {barcodeData !== "" && (
          <View style={styles.resultContainer}>
            <View style={styles.resultInnerContainer}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#FFFFFF"
                style={styles.resultIcon}
              />
              <Text style={styles.resultText}>
                Last scanned: {barcodeData.substring(0, 20)}
                {barcodeData.length > 20 ? "..." : ""}
              </Text>
            </View>
          </View>
        )}
      </CameraView>
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: "black", marginTop: -10, paddingBottom: 10 },
        ]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            console.log("change to scanning nfc mode");
            router.push("/nfcindex");
          }}
        >
          <Button
            mode="contained"
            icon={() => (
              <MaterialCommunityIcons name="nfc" size={24} color="white" />
            )}
          >
            Scan for NFC Tag
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles remain unchanged
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // All styles remain the same as in your original code
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 18,
    color: "#4F378B",
    fontWeight: "500",
  },

  // Permission screen styles
  permissionContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6A0DAD",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8B8B8B",
    textAlign: "center",
    marginTop: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    margin: 20,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F8F0FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6A0DAD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  featureContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6A0DAD",
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#444444",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 0,
    marginTop: 5,
    marginBottom: 10,
    // backgroundColor: "#4F378B",
    alignItems: "center",
  },
  // primaryButton: {
  //   flex: 1,
  //   backgroundColor: "#4F378B",
  //   paddingVertical: 14,
  //   borderRadius: 8,
  //   marginLeft: 0,
  //   alignItems: "center",
  //   shadowColor: "#6A0DAD",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 6,
  // },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F8F0FF",
    // paddingVertical: 5,
    borderRadius: 8,
    marginRight: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4F378B",
  },
  secondaryButtonText: {
    color: "#4F378B",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#4F378B",
    marginHorizontal: 24,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  errorIcon: {
    marginRight: 10,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },

  // Camera view styles
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  flipButton: {
    backgroundColor: "rgba(79, 55, 139,1)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanButton: {
    backgroundColor: "rgba(79, 55, 139, 0.7)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "rgba(0, 175, 82, 0.8)",
  },
  buttonIcon: {
    marginRight: 8,
  },
  flipButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  headerBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingTop: 50,
    paddingBottom: 15,
  },
  appNameText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  modeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  scannerFrameContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#6A0DAD",
    backgroundColor: "transparent",
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#6A0DAD",
    shadowColor: "#6A0DAD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  resultContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  resultInnerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  resultIcon: {
    marginRight: 8,
  },
  resultText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
