import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    try {
      console.log("Registration started"); // Log when registration starts

      const response = await axios.post(
        "http://172.17.24.211:5002/api/auth/register",
        {
          email,
          password,
        }
      );

      console.log("Response from server: ", response.data); // Log the server response

      if (response.status === 201) {
        // Registration was successful
        console.log("User registered successfully, redirecting to Login");
        navigation.replace("Login"); // Redirect to login after successful registration
      } else {
        console.log("Unexpected response status: ", response.status); // Log unexpected status
      }
    } catch (error) {
      console.error("Registration error: ", error); // Log any errors
      setErrorMessage("Failed to register, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.inputPlaceholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={theme.colors.inputPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.secondaryButtonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    titleText: "#213d30", // Forest green
    inputBorder: "#ccc", // Subtle border for inputs
    inputPlaceholder: "#888", // Muted gray for placeholders
    errorText: "#f44336", // Bright red for errors
    buttonBackground: "#1B95E0", // Bright blue
    buttonText: "#f7f5ed", // Light cream
    secondaryButtonBackground: "#ccc", // Light gray
    secondaryButtonText: "#555", // Subtle gray
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
  input: {
    height: 50,
    borderColor: theme.colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    marginBottom: 15,
    color: theme.colors.titleText,
  },
  error: {
    color: theme.colors.errorText,
    fontFamily: theme.fonts.body,
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: theme.colors.buttonBackground,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: theme.colors.buttonText,
    fontFamily: theme.fonts.title,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondaryButtonBackground,
  },
  secondaryButtonText: {
    color: theme.colors.secondaryButtonText,
    fontFamily: theme.fonts.body,
  },
});
