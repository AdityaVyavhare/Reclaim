import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Loading from "@/components/Loading";
import EmptyListComponent from "@/components/EmptyListComponent";
import React, { useEffect, useState } from "react";
import Notification from "@/components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { deleteSubcollection, getAllItems_db } from "@/database/manageItems";
import { clearNotifications, setNotification } from "@/store/notificationSlice";
export default function Notifications() {
  const [isLoading, setIsLoading] = useState(false);
  const updates = useSelector((state) => state.notification.notifications);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const styles = createStyles();
  const fetchNotifications = async () => {
    if (!user?.user?.uid) return; // Prevent errors if user is undefined
    try {
      setIsLoading(true);
      const data = await getAllItems_db(user.user.uid, "updates");
      const serializedData = data.map((notification) => ({
        ...notification,
        time: notification.time
          ? new Date(notification.time.seconds * 1000).toISOString()
          : null,
      }));
      serializedData.sort((a, b) => new Date(b.time) - new Date(a.time));
      dispatch(setNotification(serializedData));
    } catch (err) {
      console.log("Error fetching notifications:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHandler = async () => {
    try {
      dispatch(clearNotifications());
      await deleteSubcollection("users", user.user.uid, "updates");
    } catch (err) {
      console.log(err);
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [updates.length, user?.user?.uid]);
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Recent Updates</Text>
        <TouchableOpacity onPress={clearHandler}>
          <Text style={styles.clear}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Loading
          size="large"
          isLoading={isLoading}
          title="fetching recent updates..."
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={updates}
          renderItem={({ item }) => <Notification notification={item} />} // Fix here
          keyExtractor={(item, index) => `${index}`}
          ListEmptyComponent={() => (
            <EmptyListComponent message="You Haven't Received Any Updates!" />
          )}
        />
      )}
    </View>
  );
}

const createStyles = () => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 5,
      flex: 1,
      backgroundColor: "white",
    },
    title: {
      fontWeight: "bold",
      fontSize: 25,
      marginBottom: 10,
    },
    top: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingInline: 10,
    },
    clear: {
      fontWeight: 900,
      color: "#4F378B",
    },
  });
};
