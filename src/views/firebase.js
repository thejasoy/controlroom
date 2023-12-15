import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYXgh5cqCtqmEKBVsTgeZ2KuEUaM2PuF8",
  authDomain: "controlroom-10885.firebaseapp.com",
  databaseURL:
    "https://controlroom-10885-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "controlroom-10885",
  storageBucket: "controlroom-10885.appspot.com",
  messagingSenderId: "304779629227",
  appId: "1:304779629227:web:02fb633f3b3a6008deddee",
  measurementId: "G-VG6M64G1DD",
};

// Initialize Firebase app
initializeApp(firebaseConfig);

// Get Firebase services directly without assigning to a variable
const auth = getAuth();
const db = getDatabase();

export { auth, db };
