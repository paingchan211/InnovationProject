import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function Sightings({ navigation }) {
  const [sightingsData, setSightingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = [
      {
        id: "1",
        name: "Orangutan Family",
        description: "Spotted near the riverbank.",
        image: require("../assets/orangutan-1.jpg"),
      },
      {
        id: "2",
        name: "Bornean Elephant",
        description: "Seen roaming in the dense forest.",
        image: require("../assets/elephant-1.jpg"),
      },
      {
        id: "3",
        name: "Hornbill Bird",
        description: "Flying across the reserve.",
        image: require("../assets/elephant-1.jpg"),
      },
    ];

    setTimeout(() => {
      setSightingsData(data);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.loader} />
      </View>
    );
  }

  const renderSighting = ({ item }) => (
    <TouchableOpacity
      style={styles.sightingCard}
      onPress={() => navigation.navigate("AnimalDetails", { sighting: item })}
    >
      <Image source={item.image} style={styles.sightingImage} />
      <View style={styles.sightingInfo}>
        <Text style={styles.sightingName}>{item.name}</Text>
        <Text style={styles.sightingDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Sightings</Text>
      <FlatList
        data={sightingsData}
        keyExtractor={(item) => item.id}
        renderItem={renderSighting}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate("UploadImage")}
      >
        <Text style={styles.uploadButtonText}>Upload Your Image</Text>
      </TouchableOpacity>
    </View>
  );
}

const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    titleText: "#2E8B57", // Dark green
    cardBackground: "#f9f9f9", // Light card background
    descriptionText: "#555", // Subtle gray
    loader: "#1B95E0", // Bright blue
    buttonBackground: "#1B95E0", // Bright blue
    buttonText: "#f7f5ed", // Light cream
  },
  fonts: {
    title: "DynaPuff-Bold",
    body: "FuzzyBubbles-Regular",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.title,
    color: theme.colors.titleText,
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 100,
  },
  sightingCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
  },
  sightingImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  sightingInfo: {
    flex: 1,
    justifyContent: "center",
  },
  sightingName: {
    fontSize: 18,
    fontFamily: theme.fonts.title,
    color: theme.colors.titleText,
    marginBottom: 5,
  },
  sightingDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.descriptionText,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: theme.colors.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  uploadButtonText: {
    fontSize: 18,
    fontFamily: theme.fonts.title,
    color: theme.colors.buttonText,
  },
});
