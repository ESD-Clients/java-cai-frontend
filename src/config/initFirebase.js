import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAF6R96WJEKxQeAdoN9QP6a6Wyg4-fNLUM",
  authDomain: "java-cai.firebaseapp.com",
  projectId: "java-cai",
  storageBucket: "java-cai.appspot.com",
  messagingSenderId: "11159827926",
  appId: "1:11159827926:web:97988e764f99eaf1356077",
  measurementId: "G-C8VRDYNXE3"
};



const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { firebaseApp, firestore, auth, storage };