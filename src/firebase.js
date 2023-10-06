// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDoc, Firestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA41ZQbfr4-iSN7dgo8uWqjloQwxBkHOrI",
  authDomain: "contentai-3f684.firebaseapp.com",
  projectId: "contentai-3f684",
  storageBucket: "contentai-3f684.appspot.com",
  messagingSenderId: "209665008154",
  appId: "1:209665008154:web:31a5c68e9ea5f27f73e7a3",
  measurementId: "G-GNJYQLC5FR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  getDoc, Firestore, initializeApp
};