import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBe7_wQ87y5YcYZVZuYK0f0mZHw3wZlGjQ",
  authDomain: "artesanias-inca-peru.firebaseapp.com",
  projectId: "artesanias-inca-peru",
  storageBucket: "artesanias-inca-peru.firebasestorage.app",
  messagingSenderId: "852530942580",
  appId: "1:852530942580:web:a3660ce9a291fa05d23721",
};

export const isFirebaseConfigured = firebaseConfig.apiKey !== "TU_API_KEY";

console.log("[FIREBASE CONFIG] Proyecto:", firebaseConfig.projectId);
console.log(
  "[FIREBASE CONFIG] Auth + Firestore + Storage configurados:",
  isFirebaseConfigured,
);

const firebaseAppName = "artesanias-inca-peru";
const existingApp = getApps().find((app) => app.name === firebaseAppName);
const app = existingApp ?? initializeApp(firebaseConfig, firebaseAppName);
console.log("[FIREBASE CONFIG] Firebase App inicializada:", app.name);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
