import { Linking, Alert, PanResponder, Platform } from "react-native";

export const makeCall = (phoneNumber) => {
  const phoneUrl = `tel:${phoneNumber}`;

  Linking.openURL(phoneUrl).catch(() => {
    Alert.alert("Error", "Unable to make a call. Please check your settings.");
  });
};

export const makeSMS = (phoneNumber) => {
  const phoneUrl = `sms:${phoneNumber}`;

  Linking.openURL(phoneUrl).catch(() => {
    Alert.alert("Error", "Unable to send an SMS. Please check your settings.");
  });
};

export const sendEmail = async (email, itemName) => {
  const subject = "Regarding Your Item";
  const body = `Hello, I came across your item "${itemName}" and wanted to inform you. Please let me know how I can return it to you.`;

  const gmailAppUrl = `googlegmail://co?to=${email}&subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  try {
    // Check and open Gmail App (Android only)
    const canOpenGmailApp = await Linking.canOpenURL(gmailAppUrl);
    if (canOpenGmailApp) {
      await Linking.openURL(gmailAppUrl);
      return;
    }

    // Fallback to default email client
    await Linking.openURL(mailtoUrl);
  } catch (err) {
    console.error("Error opening email client:", err);
    Alert.alert("Error", "Could not open email client");
  }
};

export const openGoogleMaps = (query) => {
  const url = Platform.select({
    ios: `comgooglemaps://?q=${encodeURIComponent(query)}`, // iOS app scheme
    android: `geo:0,0?q=${encodeURIComponent(query)}`, // Android geo scheme
  });

  // Fallback for both platforms (opens in browser)
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        return Linking.openURL(webUrl); // open in browser
      }
    })
    .catch((err) => {
      console.error("Failed to open Google Maps:", err);
    });
};
