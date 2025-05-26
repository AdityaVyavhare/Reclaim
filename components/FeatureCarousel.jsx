import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";

// const { width } = Dimensions.get("window");
const width = 425;
const carouselItems = [
  {
    title: "Quick Report",
    description: "Report a lost item in seconds.",
    icon: "https://img.icons8.com/color/96/report-card.png",
  },
  {
    title: "Scan QR/NFC",
    description: "Instantly scan tags to claim or report.",
    icon: "https://img.icons8.com/color/96/qr-code.png",
  },
  {
    title: "Nearby Lost Items",
    description: "See items found near your location.",
    icon: "https://img.icons8.com/color/96/worldwide-location.png",
  },
  {
    title: "Rewards & Points",
    description: "Earn points for helping others!",
    icon: "https://img.icons8.com/color/96/gift.png",
  },
];

const FeaturesCarousel = () => {
  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={width * 0.8}
        height={150}
        autoPlay={true}
        data={carouselItems}
        scrollAnimationDuration={1000}
        renderItem={({ index }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: carouselItems[index].icon }}
              style={styles.icon}
            />
            <Text style={styles.title}>{carouselItems[index].title}</Text>
            <Text style={styles.description}>
              {carouselItems[index].description}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default FeaturesCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: "100%",
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
  },
});
