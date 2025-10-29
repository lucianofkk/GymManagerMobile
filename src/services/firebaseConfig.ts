// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyDDq7N-RJKigchEiVinipn0_eCBBjjzyUA",
        authDomain: "veo-s-gym.firebaseapp.com",
        projectId: "veo-s-gym",
        storageBucket: "veo-s-gym.firebasestorage.app",
        messagingSenderId: "969800226524",
        appId: "1:969800226524:web:f54bdd8a35a23633424619",
        measurementId: "G-E2SCBGZ2S0"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);