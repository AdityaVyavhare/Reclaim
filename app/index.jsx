import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import Signin from "@/components/signin";
import "expo-dev-client";
import auth from "@react-native-firebase/auth";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import HeaderLeft from "@/components/HeaderLeft";
import HeaderRight from "@/components/HeaderRight";
import React from "react";
import { FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modell from "@/components/Modell";
import Loading from "@/components/Loading";
import FeatureCarousel from "@/components/FeatureCarousel";
import getitemDetails from "@/utils/getitemDetails";
import { getuserProfile } from "@/database/manageUsers";
import * as Notifications from "expo-notifications";
import { addNotification } from "@/store/notificationSlice";
import { getAllItems_db } from "@/database/manageItems";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const actionCards = [
  {
    title: "Report Lost Item",
    icon: "alert-circle-outline",
    route: "/(community)",
  },
  {
    title: "Scan QR/NFC",
    icon: "qrcode-scan",
    route: "/(tags)",
  },
  {
    title: "Track last Location",
    icon: "map-marker-radius-outline",
    route: "/(items)",
  },
  {
    title: "Privacy Control",
    icon: "security",
    route: "/(settings)/PrivacyControl",
  },
];

export default function Index() {
  const { itemId } = useLocalSearchParams();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [itemOwnerDetails, setItemOwnerDetails] = useState(null);
  const [itemLength, setItemLength] = useState(0);
  const dispatch = useDispatch();
  const styles = createStyles();
  const router = useRouter();
  const responseListener = useRef();
  const notificationListener = useRef();
  const items = useSelector((state) => state.items.registeredItems);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    router.replace({
      pathname: "/",
      params: {},
    });
  };

  const fetchItemDetails = async (item_id) => {
    setOpenDialog(true);
    const [item_owner_details, item_details] = await getitemDetails(
      item_id,
      user.user
    );
    setItemOwnerDetails(item_owner_details);
    setItemDetails(item_details);
    setIsLoading(false);
  };

  const refreshItemsData = async () => {
    if (user.user?.uid) {
      try {
        const items = await getAllItems_db(user.user.uid, "registeredItems");
        setItemLength(items.length);
      } catch (error) {
        console.error("Error refreshing items:", error);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh items data
      await refreshItemsData();

      // You can add more refresh operations here if needed
      // For example: refresh user profile, notifications, etc.
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (itemId) {
      fetchItemDetails(itemId);
    }
  }, [user.user]);

  const onAuthStateChanged = async (user) => {
    const userProfilesDetails = await getuserProfile(user.uid);
    if (userProfilesDetails) {
      dispatch(setUser({ ...userProfilesDetails, uid: user.uid }));
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    user.user &&
      getAllItems_db(user.user.uid, "registeredItems").then((val) =>
        setItemLength(val.length)
      );
  }, [user?.user?.uid, items.length]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: user.user,
      headerLeft: () => <HeaderLeft user={user} />,
      headerRight: () => <HeaderRight user={user} />,
    });
  }, [user?.user?.uid, navigation]);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const notificationData = notification.request.content.data;
        dispatch(
          addNotification({
            ...notificationData,
            time: new Date(Date.now()).toISOString(),
          })
        );
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const notificationData = response.notification.request.content.data;
        if (Object.keys(notificationData)[0] != "android.nfc.extra.ID") {
          dispatch(
            addNotification({
              ...notificationData,
              time: new Date(Date.now()).toISOString(),
            })
          );
          router.push("/(community)/Notifications");
        }
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (user.user === null) return <Signin />;
  if (initializing)
    return <Loading size="large" isLoading={true} title="Loading..." />;

  return (
    <View style={styles.container}>
      {openDialog && (
        <Modell
          openDialog={true}
          handleCloseDialog={handleCloseDialog}
          isLoading={isLoading}
          itemOwnerDetails={itemOwnerDetails}
          itemDetails={itemDetails}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F378B"]} // Android
            tintColor="#4F378B" // iOS
          />
        }
      >
        {/* Feature Carousel */}
        <FeatureCarousel />

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceTitle}>Claimable Items</Text>
            <Text style={styles.balanceCount}>{itemLength} Items</Text>
          </View>
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(community)")}
            >
              <Text style={styles.actionText}>Report Lost</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(community)/Notifications")}
            >
              <Text style={styles.actionText}>View Found</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.cardContainer}>
          {actionCards.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card]}
              onPress={() => router.push(item.route)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={30}
                color="#4F378B"
              />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    fullWidthCard: {
      width: "90%", // 👈 Almost full width
      alignSelf: "center", // 👈 Center align
    },

    container: {
      flex: 1,
      backgroundColor: "#F9FAFB",
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    balanceCard: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
    },
    balanceTitle: {
      fontSize: 16,
      color: "#6B7280",
    },
    balanceCount: {
      fontSize: 28,
      fontWeight: "bold",
      marginVertical: 10,
    },
    balanceActions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    actionButton: {
      backgroundColor: "#E5E7EB",
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 20,
    },
    actionText: {
      color: "#111827",
      fontWeight: "600",
    },
    cardContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 20,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 20,
      margin: 5,
      alignItems: "center",
      justifyContent: "center",
      width: "47%",
      height: 120,
    },
    cardTitle: {
      marginTop: 10,
      textAlign: "center",
      fontWeight: "600",
    },
  });
