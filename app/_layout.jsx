import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Notifications from "expo-notifications";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { StatusBar, Linking } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
import { store } from "@/store/store";
import { Provider } from "react-redux";
import { useEffect } from "react";

export default function TabLayout() {
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
              title: "Settings",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="cog" color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </Provider>
  );
}
