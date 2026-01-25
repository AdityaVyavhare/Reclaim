import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const EmptyListComponent = ({
  message = "No items found",
  iconName = "inbox",
  iconSize = 60,
  iconColor = "#ccc",
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 500,
  },
  message: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
});

export default EmptyListComponent;
