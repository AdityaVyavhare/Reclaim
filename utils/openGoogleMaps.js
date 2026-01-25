import { Linking, Platform } from "react-native";

const openGoogleMaps = (latitude, longitude, label = "Location") => {
  // Format coordinates for different platforms
  const coords = `${latitude},${longitude}`;
  console.log("cords", coords);

  const url = Platform.select({
    ios: `comgooglemaps://?q=${coords}&center=${coords}&zoom=15`,
    android: `geo:${coords}?q=${coords}(${encodeURIComponent(label)})`,
  });

  // Fallback for both platforms (opens in browser)
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${coords}`;

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

export default openGoogleMaps;
