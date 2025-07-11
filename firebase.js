import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPuYixyiqi1B9zotPS-Tqwhm8kdFv_kTE",
  authDomain: "github-b91ab.firebaseapp.com",
  projectId: "github-b91ab",
  storageBucket: "github-b91ab.appspot.com", 
  messagingSenderId: "747409062725",
  appId: "1:747409062725:web:e7b205c5b4cc61d87e9c2c",
  measurementId: "G-2WXPJ8Q3TT"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
