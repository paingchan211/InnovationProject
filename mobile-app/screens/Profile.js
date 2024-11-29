import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState({ email: "", displayName: "User" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setErrorMessage("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://172.17.24.211:5002/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000, // Add timeout
          }
        );

        setUserData(response.data);
        setErrorMessage("");
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          setErrorMessage("Connection timeout. Please try again.");
        } else if (error.response) {
          switch (error.response.status) {
            case 401:
              setErrorMessage("Session expired. Please log in again.");
              await handleLogout();
              break;
            case 404:
              setErrorMessage("User profile not found.");
              break;
            case 403:
              setErrorMessage("Access denied. Please log in again.");
              await handleLogout();
              break;
            default:
              setErrorMessage("An error occurred while fetching the profile.");
          }
        } else if (error.request) {
          setErrorMessage("Network error. Please check your connection.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } catch (error) {
      setErrorMessage("Error during logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Text style={styles.profileText}>
        <Text style={styles.label}>Email:</Text>{" "}
        {userData.email || "Not available"}
      </Text>
      <Text style={styles.profileText}>
        <Text style={styles.label}>Name:</Text>{" "}
        {userData.displayName || "Not available"}
      </Text>
      <Text style={styles.profileText}>
        <Text style={styles.label}>Role:</Text>{" "}
        {userData.role || "Not available"}
      </Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    titleText: "#213d30", // Forest green
    bodyText: "#555", // Subtle gray
    errorText: "#f44336", // Red
    primary: "#1B95E0", // Bright blue
    buttonBackground: "#213d30", // Forest green
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
    justifyContent: "center",
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.title,
    color: theme.colors.titleText,
    textAlign: "center",
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    fontFamily: theme.fonts.body,
    color: theme.colors.titleText,
  },
  error: {
    color: theme.colors.errorText,
    fontFamily: theme.fonts.body,
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: theme.colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: theme.colors.buttonText,
    fontFamily: theme.fonts.title,
    fontSize: 16,
  },
});
