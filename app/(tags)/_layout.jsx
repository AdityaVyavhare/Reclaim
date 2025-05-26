import { Stack, Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Button } from "react-native-paper";
export default function RootLayout() {
  const options = {
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: "",
    headerLeft: () => (
      <Button
        style={{
          backgroundColor: "#EEE8F5",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
        }}
      >
        <Link href=".." style={{ padding: 0 }}>
          <FontAwesome6 name="arrow-left" size={20} style={{ padding: 0 }} />
        </Link>
      </Button>
    ),
  };
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="ItemDetails" options={{ headerShown: false }} />
      <Stack.Screen name="nfcindex" options={options} />
      <Stack.Screen name="readNFC" options={options} />
    </Stack>
  );
}
