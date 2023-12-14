import React, { useEffect, useState } from 'react';
import styles from "../App.css"
import {useNavigate} from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc,getDoc, setDoc  } from "firebase/firestore";
import { signOut,getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged } from 'firebase/auth';
import { app,db } from "../Firebase/firebaseConfig";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const auth = getAuth(app);
const cardStyle = {
  backgroundColor: '#f3f3f3',
  padding: '20px',
  margin: '20px 0',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  // ... other styles you want to apply
};

export const AppWrapper = ({ children, setIsAuth, setIsInChat }) => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();
  const provider = new GoogleAuthProvider(); // Define the provider here
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(''); // Track error messages
    const [imagePreview, setImagePreview] = useState(null); // Track image preview
    const [imagePath, setImagePath] = useState(null); // Track image preview
    const [editableName, setEditableName] = useState(''); // User-editable name state
  
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const storage = getStorage();
            const pathReference = ref(storage, imagePath);

            try {
                const url = await getDownloadURL(pathReference);
                setImageUrl(url);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, [imagePath]);

    const avatar = imageUrl || 'https://via.placeholder.com/150'


  const [profile, setProfile] =useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfileRef = doc(db, "users", user.uid);
        const userProfileSnapshot = await getDoc(userProfileRef);

        if (!userProfileSnapshot.exists()) {
          // Create a new profile if it doesn't exist
          await setDoc(userProfileRef, {
            name: user.displayName || 'Anonymous',
            email: user.email,
            profilePhotoUrl: user.photoURL || 'default-profile-photo-url',
            // Add other default fields as necessary
          });
        } else {
          // Set profile state
          setProfile(userProfileSnapshot.data());
        }
      } else {
        // User is signed out
        setProfile(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);
  
// Fetch user profile data
const fetchUserProfile = async () => {
  const userUid = auth.currentUser.uid; // Get the current user ID

  const userRef = doc(db, "users", userUid); // Reference the user document in Firestore
  const userSnap = await getDoc(userRef); // Fetch the user document

  if (userSnap.exists()) {
    // User profile exists, update the state
    const profileData = userSnap.data();
    setProfile(profileData);

    // Update the image URL if available
    if (profileData.profilePhotoUrl) {
      setImageUrl(profileData.profilePhotoUrl);
    } else {
      setImageUrl(null); // Set to null if no URL exists
    }
  } else {
    // User profile doesn't exist, handle error or create a new one
    console.warn("User profile doesn't exist!");
  }
};


// Edit profile function
const editProfile = () => {
  // Your edit logic here
};

// Change password function
const changePassword = () => {
  // Your change password logic here
};

// Handle file change for image upload
const handleFileChange = (event) => {
  // Your file change logic here
};

// Handle image upload
const handleImageUpload = async (event) => {
  event.preventDefault();
  // Your image upload logic here
};

// Handle name change
const handleNameChange = (event) => {
  setEditableName(event.target.value);
};



  const signUserOut = async () => {
    await signOut(auth); // Sign out from Firebase authentication
    cookies.remove("auth-token"); // Remove the auth token cookie
    setIsAuth(false); // Update authentication state
    setIsInChat(false); // Update chat session state
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>USVI Explorer</h1>
      </div>
      <div className="app-container">
        {children}
      </div>
      {isAuth && (
        <div className="sign-out">
          <button onClick={signUserOut}>Sign Out</button>
        </div>
      )}
    <div>
   
  <h1 className={styles.header}>Your Profile</h1>

  {loading && <p>Loading profile...</p>}
  {error && (
    <>
      <p className={styles.error}>{error}</p>
      <button onClick={fetchUserProfile} className={styles.retryButton}>Retry</button>
    </>
  )}

        {!loading && !error && (
          <>
            <div className={styles.profileCard}>
              <useUserProfile/>
              <img src={profile.avatar} alt="User profile" className={styles.profileImage} />
              <h2>{profile.name}</h2>
              <p>Email: {profile.email}</p>
              <p>Contact: {profile.contact}</p>
              <button onClick={editProfile} className={styles.editButton}>Edit Profile</button>
              <button onClick={changePassword} className={styles.changePasswordButton}>Change Password</button>
            </div>
            <form onSubmit={handleImageUpload}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button type="submit">Upload Image</button>
              {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
            </form>
            <input type="text" value={editableName} onChange={handleNameChange} />
          </>
        )}
      </div> 
</div>

);
}
