import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { addUser, getuserProfile, updateProfile } from "@/database/manageUsers";
import AppLogo from "../assets/images/splash-icon.png";
import backgoundImage from "../assets/images/sigin_background.jpg";
import registerForPushNotificationsAsync from "@/utils/registerForPushNotificationsAsync";
import Loading from "./Loading";

GoogleSignin.configure({
  webClientId:
    "1089048669519-8j5464jaolk644huojdl802ggj67856b.apps.googleusercontent.com",
  scopes: ["profile"],
});

export default function Signin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  async function onGoogleButtonPress() {
    try {
      // await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const googleSignInResult = await GoogleSignin.signIn();
      setIsLoading(true);

      const googleCredential = auth.GoogleAuthProvider.credential(
        googleSignInResult.data?.idToken
      );

      const { user } = await auth().signInWithCredential(googleCredential);
      const userProfilesDetails = await getuserProfile(user.uid);
      const expotoken = await registerForPushNotificationsAsync();

      if (userProfilesDetails) {
        console.log("old:", userProfilesDetails.expotoken);
        console.log("new:", expotoken);
        if (userProfilesDetails.expotoken !== expotoken) {
          dispatch(
            setUser({ ...userProfilesDetails, uid: user.uid, expotoken })
          );
          await updateProfile(user.uid, { expotoken });
        } else {
          dispatch(setUser({ ...userProfilesDetails, uid: user.uid }));
        }
        router.replace("/");
      } else {
        const temp = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          privacy: {
            phone: true,
            email: true,
            location: true,
          },
          location: null,
          expotoken,
        };
        dispatch(setUser({ ...temp, uid: user.uid }));
        await addUser(user.uid, temp);
        setIsLoading(false);
        router.push("(settings)/UpdateProfile");
      }
    } catch (err) {
      console.log("failed to singin\n\n");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  const styles = createStyles();

  const content = isLoading ? (
    <Loading
      size="large"
      isLoading={isLoading}
      title="Creating Your Account..."
    />
  ) : (
    <ImageBackground
      source={backgoundImage}
      imageStyle={styles.backgroundImage}
      style={styles.background}
    >
      {/* Black Overlay */}
      <View style={styles.overlay} />

      {/* Sign-in Card */}
      <View style={styles.signupContainer}>
        <View style={styles.image_container}>
          <Image style={styles.logo} source={AppLogo} resizeMode="contain" />
        </View>
        <TouchableOpacity onPress={onGoogleButtonPress}>
          <Button mode="contained" icon="google">
            Sign in With Google
          </Button>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  return content;
}

const createStyles = () => {
  return StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backgroundImage: {
      marginLeft: -100,
      marginBottom: 150,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    signupContainer: {
      justifyContent: "center",
      backgroundColor: "#fff",
      padding: 20,
      paddingTop: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      zIndex: 1,
    },
    image_container: {
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
    },
    logo: {
      width: 150,
      height: 150,
    },
  });
};
