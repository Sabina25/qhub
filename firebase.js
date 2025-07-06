// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPuYixyiqi1B9zotPS-Tqwhm8kdFv_kTE",
  authDomain: "github-b91ab.firebaseapp.com",
  projectId: "github-b91ab",
  storageBucket: "github-b91ab.firebasestorage.app",
  messagingSenderId: "747409062725",
  appId: "1:747409062725:web:e7b205c5b4cc61d87e9c2c",
  measurementId: "G-2WXPJ8Q3TT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);