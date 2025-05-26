import { getuserProfile } from "@/database/manageUsers";
import { makeCall, makeSMS, openGoogleMaps, sendEmail } from "@/utils/contact";
import dayAgo from "@/utils/dayAgo";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Divider, Surface } from "react-native-paper";
const LostItemPost = ({ post }) => {
  if (!post) return;
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const [userr, setUserr] = useState({});
  const fetchOwnerDetails = async () => {
    const data = await getuserProfile(post.uid);
    setUserr(data);
  };

  useEffect(() => {
    fetchOwnerDetails();
  }, []);
  return (
    <Surface style={styles.card} elevation={0}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image source={{ uri: userr?.photoURL }} style={styles.profilePic} />
        <View>
          <Text style={styles.userName}>{userr?.displayName}</Text>
          <TouchableOpacity
            onPress={() => sendEmail(userr?.email, post?.itemName)}
          >
            <Text style={styles.userEmail}>{userr?.email}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Divider style={styles.Divider} />

      {/* Item Content */}
      <View style={styles.content}>
        <View style={styles.posttop}>
          <Text style={styles.title}>{post?.itemName}</Text>
          <TouchableOpacity
            style={styles.location}
            onPress={() => openGoogleMaps(post?.location)}
          >
            <EvilIcons name="location" size={20} color="#4F378B" />
            <Text style={styles.description}>lost location</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text
          style={styles.description}
          numberOfLines={showFullDescription ? null : 2}
        >
          {post?.description}
        </Text>
        <TouchableOpacity onPress={handleToggleDescription}>
          <Text style={styles.readMore}>
            {showFullDescription ? "Show less" : "...Read more"}
          </Text>
        </TouchableOpacity>

        {/* Item Image */}
        <Image
          source={{ uri: post.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Divider style={styles.Divider} />

      {/* Bottom Buttons */}
      <View style={styles.bottom}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => makeCall(userr?.phoneNumber)}>
            <Ionicons name="call-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => makeSMS(userr?.phoneNumber)}>
            <Ionicons name="chatbox-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Text>{`lost ${dayAgo(post.dateLost)}`}</Text>
      </View>
    </Surface>
  );
};

export default LostItemPost;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  location: {
    flexDirection: "row",
    maxWidth: 100,
    overflow: "hidden",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(0,0,0,.1)",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4F378B",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,.1)",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
  },
  readMore: {
    fontSize: 12,
    color: "#4F378B",
    marginBottom: 5,
    fontWeight: "bold",
    opacity: 0.75,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  icon: {
    fontSize: 16,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 0,
    paddingBottom: 10,
    gap: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
  Divider: {
    marginVertical: 5,
    width: 300,
    marginInline: "auto",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingInline: 20,
    paddingVertical: 5,
  },
  posttop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
