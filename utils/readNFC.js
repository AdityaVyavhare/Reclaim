import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import { Alert, Platform } from "react-native";

// Ensure NFC is started
NfcManager.start();

const ReadNFC = async () => {
  try {
    console.log("Checking NFC support...");

    // Check if NFC is supported
    const supported = await NfcManager.isSupported();
    if (!supported) {
      Alert.alert("Error", "NFC is not supported on this device");
      return null;
    }

    // Ensure NFC is enabled on Android
    if (Platform.OS === "android") {
      const enabled = await NfcManager.isEnabled();
      if (!enabled) {
        Alert.alert("NFC Disabled", "Please enable NFC in device settings");
        return null;
      }
    }

    console.log("NFC is supported and enabled!");

    // Request NFC technology
    await NfcManager.requestTechnology(NfcTech.Ndef);

    console.log("NFC Technology acquired...");

    // Read NFC tag
    const tag = await NfcManager.getTag();

    console.log("Full NFC Tag Data:", tag);

    if (!tag || !tag.ndefMessage || tag.ndefMessage.length === 0) {
      Alert.alert("No Data", "This NFC tag is empty or unsupported.");
      return null;
    }

    // Decode first NDEF record
    const ndefRecord = tag.ndefMessage[0];
    let decodedData;

    if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
      if (Ndef.uri.decodePayload(ndefRecord.payload)) {
        // URI Record
        decodedData = Ndef.uri.decodePayload(ndefRecord.payload);
      } else {
        // Text Record
        decodedData = Ndef.text.decodePayload(ndefRecord.payload);
      }
    }

    console.log("Decoded NFC Data:", decodedData);

    if (decodedData) {
      // Alert.alert("NFC Tag Read!", `Data: ${decodedData}`);
      return decodedData;
    } else {
      Alert.alert("Unreadable", "Could not interpret NFC tag data");
      return null;
    }
  } catch (error) {
    console.error("NFC Read Error:", error);
    Alert.alert("Error", `Failed to read NFC tag: ${error.message}`);
    return null;
  } finally {
    console.log("Releasing NFC technology...");
    await NfcManager.cancelTechnologyRequest();
  }
};

export default ReadNFC;
