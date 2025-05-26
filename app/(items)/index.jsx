import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Searchbar } from "react-native-paper";
import { useEffect, useState } from "react";
import Item from "@/components/Item";
import { useSelector, useDispatch } from "react-redux";
import { getAllItems_db } from "@/database/manageItems";
import { setItems } from "@/store/itemsSlice";
import Loading from "@/components/Loading";
import { Link } from "expo-router";
import EmptyListComponent from "@/components/EmptyListComponent";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const items = useSelector((state) => state.items.registeredItems);
  const dispatch = useDispatch();

  // In your component, add this state:
  const [refreshing, setRefreshing] = useState(false);

  // Add a refresh handler function

  const uid = useSelector((state) => state.user?.user?.uid);
  const styles = createStyles();

  const fetchAllItems = async () => {
    try {
      const data = await getAllItems_db(uid, "registeredItems");
      const serializedData = data.map((item) => ({
        ...item,
        dateRegistered: item.dateRegistered
          ? new Date(item.dateRegistered.seconds * 1000).toISOString()
          : null,
      }));
      serializedData.sort(
        (a, b) => new Date(b.dateRegistered) - new Date(a.dateRegistered)
      );

      dispatch(
        setItems({ collection_name: "registeredItems", data: serializedData })
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    uid && fetchAllItems();
  }, [uid, items.length]);

  const filterItems = (items) => {
    return items.filter(
      (item) =>
        item?.itemName
          .toLowerCase()
          .includes(searchQuery.toLocaleLowerCase()) ||
        item?.itemCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setIsLoading(true);
    await fetchAllItems();
    setRefreshing(false);
  };

  const content = (
    <View style={styles.container}>
      <Text style={styles.title}>Your Items</Text>
      <View style={styles.input_container}>
        <Searchbar
          style={styles.searchbar}
          mode="bar"
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder="Ex: bottle"
        />
        <TouchableOpacity style={styles.pressable}>
          <Link href="/AddItem" params={{ update: false }}>
            <Ionicons name="add-outline" size={30} color={"white"} />
          </Link>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loading
          size="large"
          isLoading={isLoading}
          title="fetching our items"
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.item_container}
          data={searchQuery ? filterItems(items) : items}
          renderItem={({ item }) => (
            <Item fetchAllItems={fetchAllItems} item={item} />
          )}
          keyExtractor={(item) => item.iid.toString()}
          ListEmptyComponent={EmptyListComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );

  return content;
}

const createStyles = () =>
  StyleSheet.create({
    dialog: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 5,
    },
    dialogTitle: {
      fontSize: 25,
      fontWeight: "900",
      color: "#333",
      textAlign: "center",
    },
    profile: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
    },
    profile_picture: {
      height: 50,
      width: 50,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: "#584192",
    },
    profile_right: {
      flex: 1,
      gap: 5,
      padding: 5,
    },
    profile_name: {
      fontSize: 15,
      fontWeight: "700",
      color: "#000",
    },
    profile_email: {
      fontSize: 12,
      color: "#584192",
      textDecorationLine: "underline",
    },
    divider: {
      marginVertical: 10,
    },
    top: {
      flexDirection: "row",
      alignItems: "start",
      gap: 10,
      paddingBlock: 5,
    },
    item_image: {
      width: 100,
      height: 100,
      borderRadius: 10,
      backgroundColor: "rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: 15,
      fontWeight: "700",
      color: "#000",
    },
    category: {
      fontSize: 13,
      color: "#000",
    },
    description: {
      fontSize: 12,
      color: "#555",
      flexShrink: 1,
      maxWidth: 180,
    },

    info: {
      gap: 3,
    },
    status: {
      fontSize: 10,
      color: "black",
      backgroundColor: "rgba(255, 0, 0, 0.1)",
      borderColor: "red",
      marginTop: 12,
    },
    actions: {
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    contactButton: {
      backgroundColor: "#584192",
      borderRadius: 8,
      paddingVertical: 5,
      paddingHorizontal: 15,
    },
    closeButton: {
      borderColor: "#584192",
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 5,
      paddingHorizontal: 15,
    },
    buttonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
    buttonTextOutlined: {
      color: "#584192",
      fontSize: 14,
      fontWeight: "600",
    },
    contact: {
      flexDirection: "row",
      gap: 25,
      paddingInline: 10,
    },

    container: {
      paddingInline: 20,
      paddingTop: 10,
      paddingBottom: 5,
      flex: 1,
    },
    title: {
      fontWeight: "bold",
      fontSize: 25,
      marginBottom: 5,
    },
    input_container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(0,0,0,.1)",
      marginTop: 10,
    },
    searchbar: {
      borderRadius: 10,
      width: "82%",
    },
    pressable: {
      borderRadius: 10,
      backgroundColor: "#584192",
      padding: 12,
    },
    item_container: {
      flex: 1,
      marginTop: 15,
    },
  });
