import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Notifications from "expo-notifications";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { StatusBar, Linking, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
import { store } from "@/store/store";
import { Provider } from "react-redux";
import { useEffect, useRef } from "react";

import { useRouter } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function TabLayout() {
  const router = useRouter(); // For navigation on tap
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
    });
    
    // Ensure channel exists (critical for Android 8+)
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const linking = {
    prefixes: ["reclaim://", "https://reclaimmm.netlify.app"],
    config: {
      screens: {
        index: "",
      },
    },
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          backgroundColor={"#fff"} // Sets the background color (Android only)
          barStyle={"dark-content"} // Changes the text/icons color (light/dark)
        />
        <Tabs
          linking={linking}
          screenOptions={{
            headerShown: false,
            headerShadowVisible: false,
            tabBarHideOnKeyboard: true,
            keyboardHidesTabBar: false,
            tabBarActiveTintColor: "black",
            tabBarStyle: {
              height: 65,
              paddingBottom: 15,
              paddingTop: 5,
              position: "fixed",
              bottom: 0,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Dashboard",
              headerShown: true,
              headerTitle: "",
              tabBarIcon: ({ color }) => (
                <MaterialIcons size={28} name="dashboard" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(items)"
            options={{
              title: "Items",
              tabBarIcon: ({ color }) => (
                <Feather size={28} name="box" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(tags)"
            options={{
              title: "NFC",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons size={28} name="nfc" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(community)"
            options={{
              title: "Community",
              tabBarIcon: ({ color }) => (
                <Fontisto size={28} name="persons" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(settings)"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="user" color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </Provider>
  );
}
