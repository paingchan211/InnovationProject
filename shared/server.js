const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const fetch = require("node-fetch");
const FormData = require("form-data");
const app = express();
const mime = require("mime-types"); // Recommend adding this package

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB connection using environment variable from .env
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/WildLife";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    createMockUsers(); // Create mock users only if they don't exist
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit if cannot connect to database
  });

// JWT Secret Key
const jwtSecret = process.env.JWT_SECRET || "yourFallbackSecretKey";

// MongoDB Users collection setup
const usersCollection = mongoose.connection.collection("Users");

// Token generation ensuring _id is converted to string
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );
};

// Test route to verify server is responding
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Configure multer to store files in a folder
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(
        __dirname,
        "UploadImage-Backend/static/uploads"
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir); // Create the folder if it doesn't exist
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

const { google } = require("googleapis");

// Path to your credentials file
const credentialsPath = "UploadImage-Backend/credentials/watch-drive.json";

// Your Google Drive Folder ID
const folderId = "1xiP3I5kWNUy3Ih0SwSXwQDnb7DUkKhOs";

// Authenticate using the OAuth2 credentials
const authenticateGoogleDrive = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath, // Path to your JSON credentials file
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const authClient = await auth.getClient();
  const drive = google.drive({ version: "v3", auth: authClient });
  return drive;
};

// Upload CSV to Google Drive
const uploadCsvToGoogleDrive = async (csvPath) => {
  try {
    const drive = await authenticateGoogleDrive();

    // Read the file content
    const fileMetadata = {
      name: path.basename(csvPath), // Name of the file
      parents: [folderId], // Upload to the specified folder
    };

    const media = {
      mimeType: "text/csv", // MIME type for CSV files
      body: fs.createReadStream(csvPath), // Read the file as a stream
    };

    // Upload the file to Google Drive
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink", // Return the file ID and the link to view
    });

    console.log("CSV File uploaded successfully:");
    console.log("File ID:", response.data.id);
    console.log("View file link:", response.data.webViewLink);

    return response.data.webViewLink; // Return the shareable link
  } catch (error) {
    console.error("Error uploading CSV file to Google Drive:", error);
    throw new Error("Failed to upload file to Google Drive");
  }
};

// Your API route for handling the file upload and processing
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create a new FormData instance for image processing
    const processingFormData = new FormData();
    processingFormData.append("file", fs.createReadStream(req.file.path));

    try {
      // Send file to image processing service
      const processingResponse = await fetch(
        "http://localhost:8000/process-image/",
        {
          method: "POST",
          body: processingFormData,
          headers: processingFormData.getHeaders(),
        }
      );

      if (!processingResponse.ok) {
        throw new Error(`Processing failed: ${processingResponse.statusText}`);
      }

      const processingResult = await processingResponse.json();

      // Paths for the processed image and CSV file
      const annotatedImagePath = `UploadImage-Backend${processingResult.image_path}`;
      const csvPath = `UploadImage-Backend${processingResult.csv_path}`;

      // Determine the correct MIME type for the image
      const mimeType = mime.lookup(annotatedImagePath) || "image/jpeg";

      // Create FormData for Imgur upload
      const annotatedImgurFormData = new FormData();
      annotatedImgurFormData.append(
        "image",
        fs.createReadStream(annotatedImagePath),
        {
          filename: path.basename(annotatedImagePath),
          contentType: mimeType,
        }
      );

      console.log("Imgur Upload - Image Details:", {
        path: annotatedImagePath,
        filename: path.basename(annotatedImagePath),
        mimeType: mimeType,
      });

      // Upload image to Imgur
      const annotatedImgurResponse = await axios.post(
        "https://api.imgur.com/3/upload",
        annotatedImgurFormData,
        {
          headers: {
            ...annotatedImgurFormData.getHeaders(),
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      // Upload the CSV file to Google Drive
      const csvLink = await uploadCsvToGoogleDrive(csvPath);

      // Return the Imgur link for the uploaded image and Google Drive link for the CSV
      res.status(200).json({
        annotatedImageLink: annotatedImgurResponse.data.data.link,
        csvLink: csvLink,
        processingServiceResponse: processingResult,
      });
    } catch (processingError) {
      console.error("Error processing image:", processingError);
      if (processingError.response) {
        console.error("Detailed Imgur error:", processingError.response.data);
        res.status(processingError.response.status).json({
          error: "Failed to process or upload image",
          details: processingError.response.data,
        });
      } else {
        res.status(500).json({
          error: "Failed to process image",
          details: processingError.message,
        });
      }
    }
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({ error: "Server error during file upload" });
  }
});

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = {
      email,
      password: hashedPassword,
      role: role || "user", // Default role is 'user'
    };

    // Insert user into the Users collection
    await usersCollection.insertOne(newUser);

    // Generate token and send response
    const token = generateToken(newUser);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token and send response
    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add this endpoint to your server.js
app.put("/api/user/update", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = new ObjectId(decoded.userId);
    const { email, currentPassword, newPassword } = req.body;

    // Find user
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Prepare update object
    const updateData = { email };

    // If new password provided, hash it
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    await usersCollection.updateOne({ _id: userId }, { $set: updateData });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Protected route for admin
app.get("/api/admin", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden, not an admin" });
    }

    res.status(200).json({ message: "Welcome, Admin!" });
  } catch (error) {
    console.error("JWT error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

// Fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Update user details
app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const updateData = req.body;

    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

// Profile endpoint with detailed logging
app.get("/api/auth/profile", async (req, res) => {
  console.log("Profile endpoint hit");
  console.log("Authorization header:", req.headers.authorization);

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ error: "Unauthorized, token missing" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded token:", decoded);

    if (!decoded.userId) {
      console.log("No userId in token");
      return res.status(401).json({ error: "Invalid token format" });
    }

    let userId;
    try {
      userId = new ObjectId(decoded.userId);
      console.log("Converted userId:", userId);
    } catch (error) {
      console.error("ObjectId conversion error:", error);
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await usersCollection.findOne({ _id: userId });
    console.log("Found user:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const response = {
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
      role: user.role,
    };
    console.log("Sending response:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Profile fetch error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// File type validation middleware
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "UploadImage-Backend/static/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync("UploadImage-Backend/static/uploads")) {
  fs.mkdirSync("UploadImage-Backend/static/uploads");
}

// Update the WildLife Schema to include base64 data and specify collection
const WildLifeSchema = new mongoose.Schema(
  {
    image_filename: {
      type: String,
      required: true,
    },
    image_data: {
      type: String, // for base64 image data
      required: true,
    },
    csv_filename: {
      type: String,
      required: true,
    },
    csv_data: {
      type: String, // for base64 CSV data
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "WildLife", // Explicitly specify the collection name
  }
);

// Create WildLife model
const WildLife =
  mongoose.models.WildLife || mongoose.model("WildLife", WildLifeSchema);

app.get("/api/data", async (req, res) => {
  try {
    const data = await WildLife.find({}).sort({ createdAt: -1 }).lean().exec();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No data found",
      });
    }

    // Transform dates to ISO strings and handle missing fields
    const formattedData = data.map((item) => ({
      ...item,
      createdAt: item.createdAt ? item.createdAt : null, // Handle missing or invalid `createdAt`
      _id: item._id.toString(),
      imageUrl: `data:image/jpeg;base64,${item.image_data}`,
      csvUrl: `data:text/csv;base64,${item.csv_data}`,
    }));

    res.status(200).json(formattedData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// Updated save data endpoint to handle base64 data
app.post("/api/save-data", async (req, res) => {
  try {
    const { image_filename, image_data, csv_filename, csv_data } = req.body;

    if (!image_filename || !image_data || !csv_filename || !csv_data) {
      return res.status(400).json({
        message:
          "All fields (image_filename, image_data, csv_filename, csv_data) are required",
      });
    }

    const newEntry = new WildLife({
      image_filename,
      image_data,
      csv_filename,
      csv_data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newEntry.save();

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({
      message: "Error saving data",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    // Optional: Add admin authentication check
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized, token missing" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      if (decoded.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Forbidden, admin access required" });
      }
    } catch (tokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Delete the user
    const result = await usersCollection.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
});

// Delete a WildLife entry
app.delete("/api/wildlife/:id", async (req, res) => {
  try {
    const entryId = new ObjectId(req.params.id);

    // Optional: Add admin authentication check
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized, token missing" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      if (decoded.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Forbidden, admin access required" });
      }
    } catch (tokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Delete the wildlife entry
    const result = await WildLife.deleteOne({ _id: entryId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Wildlife entry not found" });
    }

    res.status(200).json({ message: "Wildlife entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting wildlife entry:", error);
    res
      .status(500)
      .json({ error: "Error deleting wildlife entry", details: error.message });
  }
});

// Mock user creation function
const createMockUsers = async () => {
  try {
    // Check if the admin and user already exist
    const adminExists = await usersCollection.findOne({
      email: "admin@example.com",
    });
    const userExists = await usersCollection.findOne({
      email: "user@example.com",
    });

    if (!adminExists) {
      // Hash the password
      const hashedAdminPassword = await bcrypt.hash("adminpassword", 10);
      // Create a mock admin
      const adminUser = {
        email: "admin@example.com",
        password: hashedAdminPassword,
        role: "admin",
      };
      await usersCollection.insertOne(adminUser);
      console.log("Mock admin user created");
    }

    if (!userExists) {
      // Hash the password
      const hashedUserPassword = await bcrypt.hash("userpassword", 10);
      // Create a mock user
      const regularUser = {
        email: "user@example.com",
        password: hashedUserPassword,
        role: "user",
      };
      await usersCollection.insertOne(regularUser);
      console.log("Mock regular user created");
    }
  } catch (error) {
    console.error("Error creating mock users:", error);
  }
};

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
