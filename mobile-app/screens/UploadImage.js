import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const UploadImage = () => {
  const [imageUri, setImageUri] = useState(null);
  const [annotatedImageUri, setAnnotatedImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [csvUrl, setCsvUrl] = useState(null);

  const selectImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access gallery is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setAnnotatedImageUri(null);
        setCsvUrl(null);
        setError(null);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1] || "jpg";

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      const response = await axios.post(
        "http://172.17.24.211:5002/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 30000,
        }
      );

      if (response.data.annotatedImageLink) {
        setAnnotatedImageUri(response.data.annotatedImageLink);
      }

      if (response.data.csvLink) {
        setCsvUrl(response.data.csvLink);
      }

      Alert.alert("Success", "Image processed successfully");
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to upload and process image";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: uploading || !imageUri ? "#ccc" : "#1B95E0" },
        ]}
        onPress={uploadImage}
        disabled={uploading || !imageUri}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Processing..." : "Upload and Process Image"}
        </Text>
      </TouchableOpacity>

      {uploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B95E0" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}

      {annotatedImageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Annotated Image:</Text>
          <Image source={{ uri: annotatedImageUri }} style={styles.image} />
        </View>
      )}

      {csvUrl && (
        <Text style={styles.response}>
          CSV File:{" "}
          <Text style={styles.link} onPress={() => Linking.openURL(csvUrl)}>
            Open CSV
          </Text>
        </Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const theme = {
  colors: {
    primary: "#1B95E0",
    background: "#f7f5ed",
    textPrimary: "#2E8B57",
    textSecondary: "#555",
    error: "#ff4444",
    link: "#1B95E0",
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
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    width: "90%",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.fonts.title,
    color: "#fff",
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 200,
    marginVertical: 5,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  loadingContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
  },
  link: {
    color: theme.colors.link,
    textDecorationLine: "underline",
  },
  error: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.error,
    textAlign: "center",
  },
});

export default UploadImage;
