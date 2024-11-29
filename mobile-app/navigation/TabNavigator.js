import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

// Import screens
import Home from "../screens/Home";
import Sightings from "../screens/Sightings";
import Info from "../screens/Info";
import Tourism from "../screens/Tourism";
import Profile from "../screens/Profile"; // Import Profile screen

// Define the theme
const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    activeTab: "#213d30", // Forest green for active tab
    inactiveTab: "#888", // Gray for inactive tabs
    label: "#213d30", // Forest green for labels
  },
  fonts: {
    label: "DynaPuff-Bold", // Font for tab labels
  },
};

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home" // Start with the Home screen
      screenOptions={{
        tabBarActiveTintColor: theme.colors.activeTab, // Active tab color
        tabBarInactiveTintColor: theme.colors.inactiveTab, // Inactive tab color
        tabBarStyle: {
          backgroundColor: theme.colors.background, // Background color of tab bar
          borderTopWidth: 0, // Remove border for a cleaner look
          elevation: 5, // Shadow for Android
          shadowOpacity: 0.1, // Shadow for iOS
          shadowRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.label, // Custom font for labels
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: theme.colors.activeTab, // Header background
        },
        headerTintColor: theme.colors.background, // Header text color
        headerTitleStyle: {
          fontFamily: theme.fonts.label, // Header font
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Sightings"
        component={Sightings}
        options={{
          tabBarLabel: "Sightings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="visibility" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tourism"
        component={Tourism}
        options={{
          tabBarLabel: "Tourism",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-attraction" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={Info}
        options={{
          tabBarLabel: "Info",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="info" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
