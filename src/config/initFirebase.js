// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAF6R96WJEKxQeAdoN9QP6a6Wyg4-fNLUM",
  authDomain: "java-cai.firebaseapp.com",
  projectId: "java-cai",
  storageBucket: "java-cai.appspot.com",
  messagingSenderId: "11159827926",
  appId: "1:11159827926:web:97988e764f99eaf1356077",
  measurementId: "G-C8VRDYNXE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth();

export { app, firestore, auth };