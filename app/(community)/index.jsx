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
import { Searchbar, Chip } from "react-native-paper";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/store/postSlice";
import { getAllProducts } from "@/database/managePosts";
import Loading from "@/components/Loading";
import sortByDateLost from "@/utils/sortByDateLost";
import filterItems from "@/utils/filterItems";
import moment from "moment";

export default function Index() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const styles = createStyles();

  const categories = [
    "All",
    "Electronics",
    "Documents",
    "Personal Items",
    "Others",
  ];
  const dateOptions = ["All", "Last 24h", "Last Week", "Last Month"];

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
  }, []);

  const getFilteredPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery) {
      filtered = filterItems(filtered, searchQuery);
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Date filter
    if (dateFilter !== "All") {
      const now = moment();
      filtered = filtered.filter((post) => {
        const postDate = moment(post.dateLost);
        if (dateFilter === "Last 24h") return now.diff(postDate, "hours") <= 24;
        if (dateFilter === "Last Week") return now.diff(postDate, "days") <= 7;
        if (dateFilter === "Last Month")
          return now.diff(postDate, "months") <= 1;
        return true;
      });
    }

    return sortByDateLost(filtered);
  };

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

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={styles.chip}
              showSelectedOverlay
              compact
              mode={selectedCategory === item ? "flat" : "outlined"}
              background={
                selectedCategory === item ? { color: "#584192" } : null
              }
            >
              {item}
            </Chip>
          )}
          style={styles.horizontalList}
          selectedColor="black"
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dateOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={dateFilter === item}
              onPress={() => setDateFilter(item)}
              style={styles.chip}
              selectedColor="black"
              showSelectedOverlay
              compact
              mode={dateFilter === item ? "flat" : "outlined"}
              background={dateFilter === item ? { color: "#584192" } : null}
            >
              {item}
            </Chip>
          )}
          style={styles.horizontalList}
        />
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
          data={getFilteredPosts()}
          renderItem={({ item }) => <LostItemPost post={item} />}
          keyExtractor={(item, index) => `${index}`}
          ListEmptyComponent={() => (
            <EmptyListComponent message="No Posts Found" />
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
      marginBottom: 5,
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
    filterContainer: {
      marginBottom: 10,
    },
    horizontalList: {
      marginBottom: 5,
    },
    chip: {
      marginRight: 8,
      height: 35,
      justifyContent: "center",
    },
  });
