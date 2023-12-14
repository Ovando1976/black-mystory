// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; // Add this import
import { getDatabase } from "firebase/database"; // Add this import
import { getFirestore} from 'firebase/firestore';
import { getStorage, ref} from 'firebase/storage';
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"; // Add this import




// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtJtPZObAxzIir4k0h4PqKZDUr92XKUEc",
  authDomain: "cuttingedgeai.firebaseapp.com",
  databaseURL: "https://cuttingedgeai-default-rtdb.firebaseio.com",
  projectId: "cuttingedgeai",
  storageBucket: "cuttingedgeai.appspot.com",
  messagingSenderId: "1013851195112",
  appId: "1:1013851195112:web:c70bf70e6f7c753e81eb5d",
  measurementId: "G-2QEXQDXZZF"
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);


// Configure OAuth Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);



// Initialize Storage
export const storage = getStorage(app);
export const storageRef = ref(storage);


module.export =  {app, auth, db, facebookProvider, googleProvider, storage, storageRef}  ;





