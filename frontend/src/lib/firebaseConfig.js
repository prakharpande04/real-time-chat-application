import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjayAbWmeNwT1orAQHeo3KfPdKwSgJZa8",
  authDomain: "chat-application-582bd.firebaseapp.com",
  projectId: "chat-application-582bd",
  storageBucket: "chat-application-582bd.firebasestorage.app",
  messagingSenderId: "991593690195",
  appId: "1:991593690195:web:19cf437a88c48c664542a6",
  measurementId: "G-QYKBT2JFRB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);