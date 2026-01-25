import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouter } from "expo-router";
import { setUser } from "@/store/userSlice";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
const SettingsScreen = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const SingOut = async () => {
    try {
      dispatch(setUser(null));
      await auth().signOut();
      await GoogleSignin.signOut();
      router.replace("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Image
            height={50}
            width={50}
            borderRadius={50}
            source={{ uri: user?.user?.photoURL }}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.user?.displayName}</Text>
          <TouchableOpacity>
            <Link href="/UpdateProfile">
              <Text style={styles.viewProfileText}>Update Profile</Text>
            </Link>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signout} onPress={SingOut}>
          <MaterialIcons name="logout" size={30} color="#4F378B" />
        </TouchableOpacity>
      </View>

      {/* Options */}
      <OptionItem
        icon={<MaterialIcons name="card-membership" size={20} color="black" />}
        route="/YourPosts"
        title="Your Posts"
      />
      <OptionItem
        icon={<MaterialIcons name="privacy-tip" size={20} color="black" />}
        route="/PrivacyControl"
        title="Privacy Control"
      />
      <OptionItem
        icon={<Ionicons name="gift" size={20} color="black" />}
        title="Gift Card"
      />
      <OptionItem
        icon={<Ionicons name="heart-outline" size={20} color="black" />}
        title="Saved Items"
        badge="New"
      />
      <OptionItem
        icon={<Ionicons name="star-outline" size={20} color="black" />}
        title="My Rewards"
        badge="New"
      />
      <OptionItem
        icon={
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="black"
          />
        }
        title="Get help"
      />

      {/* Refer Friends Section */}
      <View style={styles.referContainer}>
        <OptionItem
          icon={<Ionicons name="person-add-outline" size={20} color="black" />}
          title="Refer Friends, Get $10"
        />
      </View>
    </ScrollView>
  );
};

// Reusable Option Item
const OptionItem = ({ icon, title, subtitle, badge, route }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => {
        route && router.push(route);
      }}
    >
      <View style={styles.optionLeft}>
        {icon}
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.optionRight}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="gray" />
      </View>
    </TouchableOpacity>
  );
};

// Styles remain unchanged
// ...
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 25,
    marginLeft: 10,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#60A5FA",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
  },
  viewProfileText: {
    color: "#584192",
    marginTop: 4,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionTextContainer: {
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgb(229, 220, 237)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    color: "#4F378B",
    fontSize: 12,
  },
  referContainer: {
    backgroundColor: "rgb(229, 220, 237)",
    marginTop: 4,
  },
  signout: {
    position: "absolute",
    right: 10,
  },
});

export default SettingsScreen;
