import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC3O1kSZnla0DBu_z7WEFMCBAYoIqlcauM",
  authDomain: "rapidaid-89e5f.firebaseapp.com",
  projectId: "rapidaid-89e5f",
  storageBucket: "rapidaid-89e5f.appspot.com",
  messagingSenderId: "151990165555",
  appId: "1:151990165555:web:f794a7fa27731717db4346",
  measurementId: "G-0FT9EV4LP8",
  databaseURL: "https://reclaim-4397d-default-rtdb.firebaseio.com/", // Important for Realtime DB
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
