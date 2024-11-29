import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import validator from "validator";
import zxcvbn from "zxcvbn";

// Security Utilities Class
class SecurityUtilities {
  static sanitizeInput(input, maxLength = 255) {
    if (!input) return "";
    return input
      .toString()
      .replace(/[<>&"'/\\]/g, "")
      .trim()
      .substring(0, maxLength);
  }

  static validateEmail(email) {
    return validator.isEmail(email) && email.length <= 100;
  }

  static validatePassword(password) {
    const minLength = 8;
    const maxLength = 64;
    const strengthResult = zxcvbn(password);

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      strengthResult.score >= 1 // Ensure minimal strength
    );
  }
}

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputValidation = useMemo(() => {
    const sanitizedEmail = SecurityUtilities.sanitizeInput(email);
    const sanitizedPassword = SecurityUtilities.sanitizeInput(password);

    const isEmailValid = SecurityUtilities.validateEmail(sanitizedEmail);
    const isPasswordValid =
      SecurityUtilities.validatePassword(sanitizedPassword);

    return {
      sanitizedEmail,
      sanitizedPassword,
      isValid: isEmailValid && isPasswordValid,
    };
  }, [email, password]);

  const handleLogin = async () => {
    if (isLoading) return;

    const { sanitizedEmail, sanitizedPassword, isValid } = inputValidation;

    if (!isValid) {
      setErrorMessage("Invalid email or password format.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://172.17.24.211:5002/api/auth/login",
        {
          email: sanitizedEmail,
          password: sanitizedPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);

        const decodedToken = JSON.parse(
          atob(response.data.token.split(".")[1])
        );

        navigation.replace(decodedToken.role === "admin" ? "Main" : "Main");
      } else {
        throw new Error("No authentication token received.");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        errorMessage =
          error.response.status === 401
            ? "Invalid credentials, please try again."
            : "Service unavailable. Please try later.";
      } else if (error.request) {
        errorMessage = "No response from the server. Check your network.";
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(SecurityUtilities.sanitizeInput(text))}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) =>
          setPassword(SecurityUtilities.sanitizeInput(text))
        }
        secureTextEntry
        editable={!isLoading}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity
        style={[
          styles.button,
          !inputValidation.isValid || isLoading ? styles.disabledButton : null,
        ]}
        onPress={handleLogin}
        disabled={!inputValidation.isValid || isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Logging In..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Register")}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>Go to Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    buttonBackground: "#213d30", // Forest green
    buttonText: "#f7f5ed", // Light cream
    inputBorder: "#ccc", // Light gray for input borders
    errorText: "#f44336", // Red
    linkText: "#1B95E0", // Bright blue
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
    color: theme.colors.buttonBackground,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: theme.colors.inputBorder,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontFamily: theme.fonts.body,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  error: {
    color: theme.colors.errorText,
    fontFamily: theme.fonts.body,
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: theme.colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: theme.colors.buttonText,
    fontFamily: theme.fonts.title,
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
  },
  linkText: {
    color: theme.colors.linkText,
    fontFamily: theme.fonts.body,
    fontSize: 14,
  },
});
