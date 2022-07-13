// Import the functions you need from the SDKs you need

import 'firebase/firestore';
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWd6bc33PLcGIqiI1tCVSHp2kNMYkgclw",
  authDomain: "curso-6a373.firebaseapp.com",
  projectId: "curso-6a373",
  storageBucket: "curso-6a373.appspot.com",
  messagingSenderId: "391538154366",
  appId: "1:391538154366:web:fde52f108fddc73627712f",
  measurementId: "G-R1H5WC0NLS"
};


let db = '';

if (getApps().length < 1) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
}
  export default db;

//const analytics = getAnalytics(app);