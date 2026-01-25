import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import { updateProfile } from "@/database/manageUsers";
import { useRouter } from "expo-router";
import Loading from "@/components/Loading";
const PrivacyControl = () => {
  const user = useSelector((state) => state.user?.user);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [privacySettings, setPrivacySettings] = useState(user.privacy);
  const dispatch = useDispatch();
  // Handler for toggling individual privacy settings
  const togglePrivacy = (field) => {
    setPrivacySettings((prevSettings) => ({
      ...prevSettings,
      [field]: !prevSettings[field],
    }));
  };

  // Icon configurations
  const getIcon = (field) => {
    const icons = {
      phone: "call",
      email: "mail",
      location: "location",
    };
    return icons[field];
  };

  // Labels for each privacy field
  const labels = {
    phone: "Phone Number",
    email: "Email Address",
    location: "Location",
  };

  // Description for each privacy field
  const descriptions = {
    phone: "Allow others to see your phone number",
    email: "Allow others to see your email address",
    location: "Allow others to share your current location",
  };

  const savePrivacy = async () => {
    try {
      setIsLoading(true);
      dispatch(setUser({ ...user, privacy: privacySettings }));
      await updateProfile(user.uid, { privacy: privacySettings });
      router.back();
    } catch (err) {
      console.log(err);
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Loading
          size="large"
          isLoading={isLoading}
          title={"Updating Your Privacy Settings"}
        />
      ) : (
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>Privacy Settings</Text>
            <Text style={styles.subtitle}>
              Control who can see your information
            </Text>
          </View>

          {Object.keys(privacySettings).map((field) => (
            <View key={field} style={styles.settingItem}>
              <View style={styles.iconContainer}>
                <Ionicons name={getIcon(field)} size={24} color="#4a4a4a" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingLabel}>{labels[field]}</Text>
                <Text style={styles.settingDescription}>
                  {descriptions[field]}
                </Text>
              </View>
              <Switch
                value={privacySettings[field]}
                onValueChange={() => togglePrivacy(field)}
                trackColor={{ false: "#d1d1d1", true: "#4F378B" }}
                thumbColor={privacySettings[field] ? "#4F378B" : "#f4f3f4"}
                ios_backgroundColor="#d1d1d1"
              />
            </View>
          ))}

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>
              Currently Visible Information:
            </Text>
            {Object.keys(privacySettings).some(
              (key) => privacySettings[key]
            ) ? (
              Object.keys(privacySettings)
                .filter((key) => privacySettings[key])
                .map((key) => (
                  <View key={key} style={styles.visibleItem}>
                    <Ionicons name={getIcon(key)} size={16} color="#4F378B" />
                    <Text style={styles.visibleText}>{labels[key]}</Text>
                  </View>
                ))
            ) : (
              <Text style={styles.noVisibleText}>
                No information is currently visible
              </Text>
            )}
          </View>
          <TouchableOpacity style={{ marginInline: 15 }} onPress={savePrivacy}>
            <Button icon="content-save" mode="contained">
              Save Privacy Settings
            </Button>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  settingDescription: {
    fontSize: 12,
    color: "#888888",
    marginTop: 3,
  },
  summaryContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },
  visibleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  visibleText: {
    fontSize: 14,
    color: "#4a4a4a",
    marginLeft: 8,
  },
  noVisibleText: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
  },
});

export default PrivacyControl;
