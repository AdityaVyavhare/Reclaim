import { View, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function HeaderRight({ user }) {
  const photoURL = user?.user?.photoURL;
  return (
    <View style={{ paddingRight: 20 }}>
      <TouchableOpacity>
        <Image
          source={{ uri: photoURL }}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "#584192",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
