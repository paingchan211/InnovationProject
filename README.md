# 🌿 Safeguarding Wildlife and Enhancing Sustainable Tourism 🦁

A project aimed at safeguarding wildlife and promoting sustainable tourism in the **Semenggoh Nature Reserve**. The system includes a **web application**, a **mobile application**, and a shared backend. Users can upload images to know the animal species. The AI model used to detect has been trained with a dataset set of over 20,000 images across 60 species.

## 🛠️ Tech Stack

### Frontend
- **Web Application**: 
  - React.js
  - HTML5
  - CSS3
  - JavaScript (ES6+)

### Mobile Application
- **Mobile Development**: 
  - React Native
  - Expo
  - JavaScript (ES6+)

### Backend
- **Server**: 
  - Node.js
  - Express.js
  - FastAPI (Python)

### Database
- **Database**: 
  - MongoDB
  - MongoDB Compass (for database management)

### Machine Learning
- **Object Detection**:
  - YOLOv8 (YOLO version 8)
  - Python
- **Image Text Extraction**:
  - Google Vision API (for extracting date/time/temperature)
- **AI Model Training**:
  - Custom dataset (20,000+ images across 60 species)

### Cloud & Integration
- **Cloud Storage**: 
  - Google Drive API
- **Cloud Vision**: 
  - Google Vision API
- **Tunneling**: 
  - ngrok

### Development Tools
- **Version Control**: Git
- **Package Managers**: 
  - npm
  - pip
- **Environment Management**: 
  - virtualenv
  - Node.js environment

### Additional Technologies
- **Authentication**: 
  - MongoDB Authentication
- **API Development**: 
  - RESTful API
  - Webhook Integration

## 📋 Table of Contents

[Rest of the original README remains the same...]

- [🔧 Installation](#installation)
- [📂 Project Structure](#project-structure)
- [🌐 Running the Web App](#running-the-web-app)
- [📱 Running the Mobile App](#running-the-mobile-app)
- [🖥️ Running the Backend](#running-the-backend)
- [💾 MongoDB Setup](#mongodb-setup)
- [⚠️ Important Notes](#important-notes)

## 🔧 Installation

To set up the project, ensure the following dependencies are installed:

- 🐍 **Python** (latest version) - [Download Python](https://www.python.org/downloads/)
- 🟢 **Node.js** (latest version) - [Download Node.js](https://nodejs.org/)
- 🌐 **ngrok** - [Download ngrok](https://ngrok.com/download)
- 🌐 **credentials** - Refer to the final project report for the download Google Drive Download Link. Place the credentials folder inside of shared/UploadImage-Backend.
- 🗄️ **MongoDB Compass** - [Download MongoDB Compass](https://www.mongodb.com/products/compass)
- 📦 **virtualenv**
  ```bash
  pip install virtualenv
  ```

Clone this repository and navigate to the respective directories for each component.

---

## 📂 Project Structure

```
.
├── 🌐 web-app             # Web application code
├── 📱 mobile-app          # Mobile application code
└── 💻 shared              # Backend logic and shared utilities
```

---

## 🌐 Running the Web App

1. Navigate to the `web-app` directory:
   ```bash
   cd web-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## 📱 Running the Mobile App

1. Navigate to the `mobile-app` directory:
   ```bash
   cd mobile-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## 🖥️ Running the Backend

### 🗄️ MongoDB Setup

- Open **MongoDB Compass**.

## 🔐 MongoDB Setup

### 🔌 Connect to MongoDB Using Mongo Shell

If MongoDB is running, you can connect to it using the mongo shell:

1. Open Command Line (Terminal)

2. Run MongoDB Shell:
   ```bash
   mongo "mongodb://wildlifeAdmin:987654321@localhost:27017/WildLife?authSource=WildLife"
   ```
   This will authenticate with the wildlifeAdmin user and connect to the WildLife database.

### 📊 Create Database and Collections

Once connected, MongoDB will create the database automatically when you insert data:

1. Switch to the WildLife database:

   ```bash
   use WildLife
   ```

2. Create Collections:
   ```bash
   db.createCollection("Users")
   db.createCollection("WildLife")
   ```
   This command creates two collections to store user and wildlife data.

### 2. 🖥️ Backend Server

1. Navigate to the `shared` directory:
   ```bash
   cd shared
   ```
2. Start the backend server:
   ```bash
   node server.js
   ```

---

### 3. 🐍 FastAPI for Animal Detection

1. Navigate to the `shared` directory and create a virtual environment:
   ```bash
   virtualenv venv
   venv\scripts\activate  # Activate the virtual environment
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   This setup is required for subsequent steps.
3. Navigate to `UploadImage-Backend` and start the FastAPI server:
   ```bash
   cd UploadImage-Backend
   uvicorn main:app --reload
   ```

---

### 4. 📤 Drive.py (Google Drive Integration)

This script monitors a folder in Google Drive for uploaded images. When an image is uploaded, it processes the file using the FastAPI server.

#### **Important**

Since `drive.py` runs on the local server, you need **ngrok** for external communication:

1. Open `ngrok.exe` and run:
   ```bash
   ngrok http 8000
   ```
2. Copy the generated URL and update the `webhook-url` in `drive.py`.

3. Run the script:
   ```bash
   cd shared
   cd UploadImage-Backend
   python drive.py
   ```

---

### 5. 📥 Upload.py (Database Integration)

This script uploads images and associated metadata (CSV files) into the `WildLife` collection in the MongoDB database.

1. Run the script:
   ```bash
   cd shared
   cd UploadImage-Backend
   python upload.py
   ```

---

## ⚠️ Important Notes

- 🛠️ Make sure all required software is properly installed before proceeding.
- 🔬 Always activate the virtual environment before running Python scripts.
- 🌐 Use the correct ngrok URL to establish a connection between the local server and Google Drive.
- 💾 Ensure the `WildLife` database exists in **MongoDB Compass** before running any backend scripts.
- 📄 The required credentials from Google Drive must be placed inside shared/UploadImage-Backend folder.

---

## 📄 License

This project is licensed under [MIT License](LICENSE) 🆓
