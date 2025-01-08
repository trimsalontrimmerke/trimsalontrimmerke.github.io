import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Optional, if you're using Firebase Authentication
import { getStorage } from "firebase/storage"; // Add Firebase Storage

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Export Firestore, Auth, and Storage
export const db = getFirestore(app);
export const auth = getAuth(app); // Optional
export const storage = getStorage(app); // Add this line for Storage
export default app;
