import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "@firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "amschema-e76e1.firebaseapp.com",
  projectId: "amschema-e76e1",
  storageBucket: "amschema-e76e1.appspot.com",
  messagingSenderId: "668728587864",
  appId: "1:668728587864:web:8259e9d5e76949725f3c2d",
  measurementId: "G-7WXQFCRYJ1"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app)
