import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyADgEjcRHAfmsve-Xu02oVsSiYrHTYzKUM",
  authDomain: "c-closedtesting.firebaseapp.com",
  projectId: "c-closedtesting",
  storageBucket: "c-closedtesting.firebasestorage.app",
  messagingSenderId: "826906834830",
  appId: "1:826906834830:web:26da7f5f055ecfb65716df"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);