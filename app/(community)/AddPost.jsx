import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import CreatePostForm from "@/components/CreatePostForm";
const AddPost = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Report Lost Item</Text>

      <ScrollView>
        <CreatePostForm />
      </ScrollView>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    marginVertical: 10,
    paddingLeft: 10,
  },
});
