import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

// Define theme
const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    titleText: "#213d30", // Forest green
    bodyText: "#555", // Subtle gray
    detailText: "#333", // Darker gray for additional details
  },
  fonts: {
    title: "DynaPuff-Bold",
    body: "FuzzyBubbles-Regular",
  },
};

export default function AnimalDetails({ route }) {
  const { sighting } = route.params; // Get the sighting data from navigation params

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={sighting.image} style={styles.sightingImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.sightingName}>{sighting.name}</Text>
        <Text style={styles.sightingDescription}>{sighting.description}</Text>
        <Text style={styles.sightingDetail}>
          More detailed information about the sighting can go here. You can
          expand this based on actual data available.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  sightingImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  sightingName: {
    fontSize: 24,
    fontFamily: theme.fonts.title,
    color: theme.colors.titleText,
    marginBottom: 10,
    textAlign: "center",
  },
  sightingDescription: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
    marginBottom: 20,
    textAlign: "justify",
    lineHeight: 22,
  },
  sightingDetail: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.detailText,
    lineHeight: 22,
    textAlign: "justify",
  },
});
