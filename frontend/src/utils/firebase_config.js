
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import GoogleAuthProvider
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlg1QKjkXxUXFAfoc_biWw-515Yw5iqTo",
  authDomain: "clevercv-resume.firebaseapp.com",
  projectId: "clevercv-resume",
  storageBucket: "clevercv-resume.appspot.com",
  messagingSenderId: "405435349497",
  appId: "1:405435349497:web:83c0ce72d3a992b799a528"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider(); // Create the provider instance

export { app, auth, db, storage, provider }; // Export the provider