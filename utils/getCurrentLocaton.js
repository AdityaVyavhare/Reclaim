import * as Location from "expo-location";
import { Alert } from "react-native";
const getCurrentLocation = async () => {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      // Permission was denied
      throw new Error("Permission to access location was denied");
    }

    // Get the current position with high accuracy
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      altitude: location.coords.altitude,
      accuracy: location.coords.accuracy,
      altitudeAccuracy: location.coords.altitudeAccuracy,
      heading: location.coords.heading,
      speed: location.coords.speed,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    Alert.alert("Error getting location", error.message);

    throw error;
  }
};

export default getCurrentLocation;
