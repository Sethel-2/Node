// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FS_API_KEY,
  authDomain: process.env.FS_AUTH_DOMAIN,
  projectId: process.env.FS_PROJECT_ID,
  storageBucket: process.env.FS_STORAGE_BUCKET,
  messagingSenderId: process.env.FS_MESSAGING_SENDER_ID,
  appId: process.env.FS_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);