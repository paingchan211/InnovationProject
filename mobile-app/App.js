import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import * as Font from "expo-font";
import { ActivityIndicator, View } from "react-native";

// Load Fonts Function
const loadFonts = async () => {
  await Font.loadAsync({
    "DynaPuff-Regular": require("./assets/fonts/DynaPuff-Regular.ttf"),
    "DynaPuff-Bold": require("./assets/fonts/DynaPuff-Bold.ttf"),
    "FuzzyBubbles-Regular": require("./assets/fonts/FuzzyBubbles-Regular.ttf"),
    "FuzzyBubbles-Bold": require("./assets/fonts/FuzzyBubbles-Bold.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const fetchFonts = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };

    fetchFonts();
  }, []);

  if (!fontsLoaded) {
    // Display a loading spinner while fonts are being loaded
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#213d30" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
