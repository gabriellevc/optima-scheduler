import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyPIP8WcRX4eHWWthVKEvJg92tnDvLNlQ",
  authDomain: "optima-scheduler.firebaseapp.com",
  projectId: "optima-scheduler",
  storageBucket: "optima-scheduler.firebasestorage.app",
  messagingSenderId: "216923778429",
  appId: "1:216923778429:web:00c8426882b52a28aeb014"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };