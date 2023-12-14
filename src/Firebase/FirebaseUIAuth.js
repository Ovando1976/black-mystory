import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import 'firebaseui/dist/firebaseui.css';
import firebaseui from 'firebaseui';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthStateTracker = () => {
  const [authInfo, setAuthInfo] = useState(null);

  useEffect(() => {
    const ui = new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        // List the authentication providers you want to support here
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const { displayName, email, emailVerified, photoURL, uid, phoneNumber, providerData } = user;
        user.getIdToken().then((accessToken) => {
          setAuthInfo({
            status: 'Signed in',
            signInText: 'Sign out',
            accountDetails: JSON.stringify({
              displayName,
              email,
              emailVerified,
              phoneNumber,
              photoURL,
              uid,
              accessToken,
              providerData,
            }, null, '  '),
          });
        });
      } else {
        // User is signed out
        setAuthInfo({
          status: 'Signed out',
          signInText: 'Sign in',
          accountDetails: 'null',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Welcome to the USVIexplorer App</h1>
      <div>{authInfo?.status}</div>
      <div>{authInfo?.signInText}</div>
      <pre>{authInfo?.accountDetails}</pre>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default AuthStateTracker;
