import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import { Alert } from "react-native";

const writeNFC = async (url, setStatus) => {
  try {
    // Cancel any existing NFC requests first
    await NfcManager.cancelTechnologyRequest();

    setStatus("NFC scanning...");

    // Ensure NFC is started and reset
    await NfcManager.start();

    // Request NFC technology with a timeout
    await NfcManager.requestTechnology(NfcTech.Ndef, 1000);

    setStatus("NFC writing...");

    // Create an NDEF record with a URL
    const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);

    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      Alert.alert("Success", "Your Item Paired With NFC!");
    } else {
      Alert.alert("Error", "Failed to encode message. Try Again!");
    }
  } catch (error) {
    console.warn("NFC Write Error:", error);
    Alert.alert("Error", error.message);
  } finally {
    // Always ensure NFC request is canceled and status is reset
    setStatus("idle");
    await NfcManager.cancelTechnologyRequest();
  }
};

export default writeNFC;
