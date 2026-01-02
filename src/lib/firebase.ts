import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA7hSzXXVmot3K_ntzov3e0rcM1jYDbDXE",
    authDomain: "peer-learning-ea4c9.firebaseapp.com",
    projectId: "peer-learning-ea4c9",
    storageBucket: "peer-learning-ea4c9.firebasestorage.app",
    messagingSenderId: "145196735102",
    appId: "1:145196735102:web:0a441d9decd8155bbf162f",
    measurementId: "G-WC6QGENF68"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
