import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import EmptyListComponent from "@/components/EmptyListComponent";
import LostItemPost from "@/components/LostItemPost";
import { Searchbar } from "react-native-paper";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/store/postSlice";
import { getAllProducts } from "@/database/managePosts";
import Loading from "@/components/Loading";
import sortByDateLost from "@/utils/sortByDateLost";
import filterItems from "@/utils/filterItems";

export default function Index() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const styles = createStyles();

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getAllProducts();
    if (data.status) {
      dispatch(setPosts(data.data));
    } else {
      console.log(data.error);
    }
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []); // Changed to empty dependency array to run only once on mount

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity>
          <Link href="Notifications">
            <Ionicons name="notifications-outline" size={25} color="#4F378B" />
          </Link>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.input_container}>
        <Searchbar
          style={styles.searchbar}
          mode="bar"
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder="Ex: bottle"
        />
        <TouchableOpacity style={styles.pressable}>
          <Link href="/AddPost">
            <Ionicons name="add-outline" size={30} color={"white"} />
          </Link>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      {isLoading ? (
        <Loading
          size="large"
          isLoading={isLoading}
          title="fetching lost item posts..."
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={
            searchQuery
              ? filterItems([...posts], searchQuery)
              : sortByDateLost([...posts])
          }
          renderItem={({ item }) => <LostItemPost post={item} />}
          keyExtractor={(item, index) => `${index}`}
          ListEmptyComponent={() => (
            <EmptyListComponent message="NO Post Found" />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 5,
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
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
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(0,0,0,.1)",
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
  });
