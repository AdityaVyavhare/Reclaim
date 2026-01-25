import { View, Text } from "react-native";
import React from "react";

export default function HeaderLeft({ user }) {
  return (
    <View
      style={{
        paddingLeft: 18,
        flexDirection: "row",
        justifyContent: "center",
        gap: 7,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontWeight: 900,
          fontSize: 25,
          fontFamily: "Arial",
        }}
      >
        Hello
      </Text>
      <Text style={{ fontWeight: 900, fontSize: 27, color: "#4F378B" }}>
        {user?.user?.displayName.split(" ")[0]}!
      </Text>
    </View>
  );
}
