import { updateProfile } from "@/database/manageUsers";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { setUser } from "@/store/userSlice";
import Loading from "@/components/Loading";
const UpdateProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const initialUser = useSelector((state) => state.user.user);
  const [user, setUserr] = useState(initialUser);
  const [loading, setLoding] = useState(false);
  const handleUpdate = async () => {
    if (user.displayName && user.email && user.phoneNumber && user.location) {
      setLoding(true);
      dispatch(setUser(user));
      await updateProfile(initialUser.uid, {
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
      });
      setLoding(false);
      router.replace("/");
    }
  };

  useEffect(() => {}, [user]);
  return loading ? (
    <Loading size="large" isLoading={loading} title="Updating Your's Profile" />
  ) : (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Update Profile</Text>

      <Image source={{ uri: user.photoURL }} style={styles.profileImage} />

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={user.displayName}
        onChangeText={(text) => setUserr({ ...user, displayName: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={user.email}
        keyboardType="email-address"
        onChangeText={(text) => setUserr({ ...user, email: text })}
      />
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={user.location}
        onChangeText={(text) => setUserr({ ...user, location: text })}
      />
      <Text style={styles.label}>Phone </Text>
      <TextInput
        style={styles.input}
        value={user.phoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
        minLength={10}
        onChangeText={(text) => setUserr({ ...user, phoneNumber: text })}
      />

      {/* <Text style={styles.label}>Profile Photo URL</Text>
      <TextInput
        style={styles.input}
        value={user.photoURL}
        onChangeText={(text) => setUserr({ ...user, photoURL: text })}
      /> */}

      <TouchableOpacity onPress={handleUpdate}>
        <Button mode="contained">Complete Profile</Button>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateProfile;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    height: 50,
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
