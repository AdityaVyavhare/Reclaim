import * as React from "react";
import { ActivityIndicator } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
const Loading = ({ isLoading, size, title }) => {
  const styles = createStyles();
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={isLoading} size={size} />
      <Text>{title}</Text>
    </View>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
  });
};

export default Loading;
