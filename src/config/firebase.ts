import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0qsZN_9Xr5A7aa4pmhleyjr-zAu9FWzs",
  authDomain: "coserve-d4d83.firebaseapp.com",
  projectId: "coserve-d4d83",
  storageBucket: "coserve-d4d83.firebasestorage.app",
  messagingSenderId: "571701374323",
  appId: "1:571701374323:web:4021294304a711fa9a906"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@coserve.in';