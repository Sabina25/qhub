// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPuYixyiqi1B9zotPS-Tqwhm8kdFv_kTE",
  authDomain: "github-b91ab.firebaseapp.com",
  projectId: "github-b91ab",
  storageBucket: "github-b91ab.firebasestorage.app",
  messagingSenderId: "747409062725",
  appId: "1:747409062725:web:e7b205c5b4cc61d87e9c2c",
  measurementId: "G-2WXPJ8Q3TT",
};

export const app = initializeApp(firebaseConfig);
isSupported().then(ok => ok && getAnalytics(app));

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

export const auth = getAuth(app);
export const storage = getStorage(app);
