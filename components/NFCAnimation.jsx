import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Loading from "./Loading";
export default function NFCAnimation({ status }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
      }}
    >
      <Image
        source={require("../assets/images/nfcscan.gif")}
        style={{ width: 300, height: 300, marginBottom: 10 }}
      />
      <TouchableOpacity
        style={{
          height: 200,
          borderRadius: 5,
        }}
      >
        <Loading size="large" isLoading={true} title={status} />
      </TouchableOpacity>
    </View>
  );
}
