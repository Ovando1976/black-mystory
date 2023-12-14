
// Import the 'app' variable
import { app} from './Firebase/firebaseConfig'; const { getAuth, GoogleAuthProvider, FacebookAuthProvider } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getStorage, getStorageReference } = require('firebase/storage');
const {getApps, initializeApp } = require('firebase/app');


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

// Initialize Authentication
const auth = getAuth(app);

// Enable Email and Password Authentication
auth.useEmulator('http://localhost:9099'); // Replace with your actual emulator URL if using
auth.enableSignInWithEmailAndPassword();

// Configure OAuth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Set Firestore Security Rules (replace with your desired rules)
db.useEmulator('http://localhost:8080'); // Replace with your actual emulator URL if using
db.settings({
  timestampsInSnapshots: true,
});

// Initialize Storage
const storage = getStorage(app);
const storageRef = getStorageReference(storage);

// Configure Public Access Rules for Storage (replace with your desired rules)
storageRef.rules({
  rules: {
    // Allow read access to all files
    '.read': true,

    // Restrict write access to authenticated users only
    '.write': 'auth != null',
  },
});


module.exports = {app, auth, db, storage, googleProvider, facebookProvider  };
