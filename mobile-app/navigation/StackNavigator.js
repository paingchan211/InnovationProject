import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import AnimalDetails from "../screens/AnimalDetails";
import UploadImage from "../screens/UploadImage"; // Import the UploadImage screen
import Tourism from "../screens/Tourism";
import Donation from "../screens/Donation";
import ContactUs from "../screens/ContactUs";
import AboutUs from "../screens/AboutUs";
import Payment from "../screens/Payment";
import Login from "../screens/Login";
import Register from "../screens/Register";

// Define the color scheme and fonts
const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    headerBackground: "#213d30", // Forest green for header
    headerText: "#f7f5ed", // Light cream for header text
    primary: "#213d30", // Forest green for primary elements
    secondary: "#8cab68", // Olive green
    text: "#213d30", // Forest green for text
    mutedText: "#555", // Subtle gray
  },
  fonts: {
    title: "DynaPuff-Bold",
    body: "FuzzyBubbles-Regular",
  },
};

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleStyle: {
          fontFamily: theme.fonts.title,
          fontSize: 20,
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AnimalDetails"
        component={AnimalDetails}
        options={({ route }) => ({
          title: route.params?.sighting.name || "Animal Details",
        })}
      />
      <Stack.Screen
        name="Tourism"
        component={Tourism}
        options={{ title: "Tourism" }}
      />
      <Stack.Screen
        name="Donation"
        component={Donation}
        options={{ title: "Donate" }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ title: "Contact Us" }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{ title: "About Us" }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{ title: "Complete Donation" }}
      />
      <Stack.Screen
        name="UploadImage"
        component={UploadImage} // Add the UploadImage screen
        options={{ title: "Upload Image" }}
      />
    </Stack.Navigator>
  );
}
