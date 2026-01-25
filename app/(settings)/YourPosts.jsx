import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { deleteProduct, getAllProducts, updateProduct } from "@/database/managePosts";
import { setPosts, removePost, updatePost } from "@/store/postSlice";
import LostItemPost from "@/components/LostItemPost";
import { Ionicons } from "@expo/vector-icons";
import { Button, TextInput, Surface, Chip } from "react-native-paper";
import Loading from "@/components/Loading";
import EmptyListComponent from "@/components/EmptyListComponent";

export default function YourPosts() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const allPosts = useSelector((state) => state.posts.posts);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form states for editing
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [dateLost, setDateLost] = useState("");

  const categories = ["Electronics", "Documents", "Personal Items", "Others"];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const result = await getAllProducts();
    if (result.status) {
      dispatch(setPosts(result.data));
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (allPosts && user) {
      const filtered = allPosts.filter((post) => post.uid === user.uid);
      setUserPosts(filtered);
    }
  }, [allPosts, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleDelete = (postId) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const result = await deleteProduct(postId);
          if (result.status) {
            dispatch(removePost(postId));
            Alert.alert("Success", "Post deleted successfully");
          }
        },
      },
    ]);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setItemName(post.itemName);
    setDescription(post.description);
    setLocation(post.location);
    setCategory(post.category || "Others");
    setDateLost(post.dateLost || "");
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!itemName || !description || !location || !category || !dateLost) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const updateData = {
      ...editingPost,
      itemName,
      description,
      location,
      category,
      dateLost,
    };

    const result = await updateProduct(editingPost.id, updateData);
    if (result.status) {
      dispatch(updatePost(updateData));
      setEditModalVisible(false);
      Alert.alert("Success", "Post updated successfully");
    }
  };

  const renderUserPost = ({ item }) => (
    <View style={styles.postWrapper}>
      <LostItemPost post={item} />
      <Surface style={styles.actionButtons} elevation={1}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );

  if (isLoading) {
    return <Loading isLoading={isLoading} title="Loading your posts..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userPosts}
        renderItem={renderUserPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<EmptyListComponent message="You haven't created any posts yet." />}
        contentContainerStyle={userPosts.length === 0 && { flex: 1 }}
      />

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent} elevation={5}>
            <Text style={styles.modalTitle}>Edit Post</Text>
            <TextInput
              label="Item Name"
              value={itemName}
              onChangeText={setItemName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Date Lost"
              value={dateLost}
              onChangeText={setDateLost}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., 2025-03-20"
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  style={styles.chip}
                  mode={category === cat ? "flat" : "outlined"}
                  selectedColor={category === cat ? "white" : undefined}
                  background={category === cat ? { color: "#584192" } : null}
                >
                  {cat}
                </Chip>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setEditModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleUpdate}
                style={styles.modalButton}
                buttonColor="#584192"
              >
                Update
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  postWrapper: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "white",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 5,
  },
  editButton: {
    backgroundColor: "#584192",
  },
  deleteButton: {
    backgroundColor: "#B00020",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 0.48,
  },
});
