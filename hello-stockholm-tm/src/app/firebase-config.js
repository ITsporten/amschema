import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "@firebase/auth"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: "angstromsmasterskapet.firebaseapp.com",
    projectId: "angstromsmasterskapet",
    storageBucket: "angstromsmasterskapet.appspot.com",
    messagingSenderId: "612305948170",
    appId: "1:612305948170:web:9461f9713c12852da919f3",
    measurementId: "G-0WF5W551Z1"
  };


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app)