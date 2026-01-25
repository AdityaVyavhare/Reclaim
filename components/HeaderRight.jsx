import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Coin from "./Coin";
import { useRouter } from "expo-router";
export default function HeaderRight({ user }) {
  const router = useRouter();
  const photoURL = user?.user?.photoURL;
  const totalReward = user?.user?.totalRewards;
  return (
    <View
      style={{
        paddingRight: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
      }}
    >
      <Coin size={30} label={totalReward} />
      <TouchableOpacity
        onPress={() => {
          router.replace("/(settings)");
        }}
      >
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
