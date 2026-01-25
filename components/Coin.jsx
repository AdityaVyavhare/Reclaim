import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const Coin = ({ size = 40, label = "$", style }) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation - more pronounced like a coin flip
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotate animation - slower and more coin-like
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );

    // Glow animation - more subtle pulsing
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    bounceAnimation.start();
    rotateAnimation.start();
    glowAnimation.start();

    return () => {
      bounceAnimation.stop();
      rotateAnimation.stop();
      glowAnimation.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  return (
    <View style={[styles.coinContainer, { width: size, height: size }, style]}>
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: (size * 1.3) / 2,
            opacity: glowOpacity,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.coin,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: bounceAnim }, { rotateY: spin }],
          },
        ]}
      >
        {/* Gold gradient effect */}
        <View
          style={[
            styles.goldGradient,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />

        {/* Outer decorative ring */}
        <View
          style={[
            styles.outerRing,
            {
              width: size * 0.85,
              height: size * 0.85,
              borderRadius: (size * 0.85) / 2,
            },
          ]}
        />

        {/* Inner decorative ring */}
        <View
          style={[
            styles.innerRing,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: (size * 0.7) / 2,
            },
          ]}
        />

        {/* Highlight effect */}
        <View
          style={[
            styles.highlight,
            {
              width: size * 0.3,
              height: size * 0.15,
              borderRadius: size * 0.1,
              top: size * 0.2,
              left: size * 0.15,
            },
          ]}
        />

        {/* Center label */}
        <Text style={[styles.label, { fontSize: size * 0.35 }]}>{label}</Text>
        {/* <Text style={[styles.label, { fontSize: size * 0.35 }]}>{"$"}</Text> */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  coinContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  glowEffect: {
    position: "absolute",
    backgroundColor: "#4F378B",
    shadowColor: "#4F378B",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 10,
  },
  coin: {
    backgroundColor: "#4F378B", // Purple base
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2D1F5C",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 12,
  },
  goldGradient: {
    position: "absolute",
    backgroundColor: "#4F378B",
    borderWidth: 3,
    borderColor: "#6B4C9A",
  },
  outerRing: {
    borderWidth: 2,
    borderColor: "#2D1F5C",
    backgroundColor: "transparent",
    position: "absolute",
  },
  innerRing: {
    borderWidth: 1,
    borderColor: "#8A6FBF",
    backgroundColor: "transparent",
    position: "absolute",
  },
  highlight: {
    backgroundColor: "#B8A3E8",
    position: "absolute",
    opacity: 0.7,
  },
  label: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 1,
    textShadowColor: "#8A6FBF",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Coin;
