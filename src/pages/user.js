import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './User.module.css';
import useUserProfile from '../hooks/useUserProfile';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc,getDoc, setDoc  } from "firebase/firestore";
import Section from '../components/Section';
import { getDatabase, set } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged } from 'firebase/auth';
import SettingsPage from './settings';
import UserProfile from './api/user/profile';
import Gallery from '../components/gallery';
import { app,db } from "../Firebase/firebaseConfig";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import  Chat  from "../components/Chat";
import Avatar from '../components/Avatar'
import Feed from "../components/feed/Feed";
import Leftbar from "../components/leftbar/Leftbar";
import Rightbar from "../components/rightbar/Rightbar";
import Topbar from "../components/topbar/Topbar";
import Expenses from "./expenses";
import Cookies from "universal-cookie"

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

const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();
  const provider = new GoogleAuthProvider(); // Define the provider here
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
  
};
  

    
       
      

function User() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profile, setProfile] = useState({});
  const [useProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [editableName, setEditableName] = useState(profile.name);
  const [error, setError] = useState(null);
  
  
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  }, [selectedFile]);
 
 
  const Profiles = [
    {
      username: "john_doe",
      email: "john.doe@example.com",
      fullName: "John Doe",
      dateOfBirth: "1990-01-01",
      phoneNumber: "123-456-7890",
      profilePictureUrl: "https://example.com/images/john.jpg",
    },
    {
      username: "jane_doe",
      email: "jane.doe@example.com",
      fullName: "Jane Doe",
      dateOfBirth: "1992-02-02",
      phoneNumber: "987-654-3210",
      profilePictureUrl: "https://example.com/images/jane.jpg",
    },
    // ... more profiles
  ];

  function loadProfiles() {
    const profilesCollectionRef = collection(db, "users");
    Profiles.forEach(async (profile) => {
      try {
        const docRef = await addDoc(profilesCollectionRef, profile);
        console.log(`Profile for ${profile.username} added with ID: ${docRef.id}`);
      } catch (error) {
        console.error("Error adding profile: ", error);
      }
    });
  }
  
  // Call this in your development environment, not in production
  loadProfiles();
  
  

  const handleNameChange = (event) => {
    setEditableName(event.target.value);
  };

  // Function to handle profile editing
  const editProfile = () => {
    // Navigate to the edit profile page or open a modal
    console.log("Edit profile clicked");
  };

  // Function to handle password change
  const changePassword = () => {
    // Navigate to the change password page or open a modal
    console.log("Change password clicked");
  };

      
      const userId = "4v3M7Ccx89TUKmVnLJD3MayYOoB3";
      
      

  
  

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // Upload image to Firebase Storage here
    const uploadImage = async (file) => {
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    };


    // Then update the Firestore document with the image URL

    const updateUserProfileImage = async (userId, imageUrl) => {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        profileImageUrl: imageUrl
      });
    };
  };

   // Define fetchUserProfile outside of useEffect
  const fetchUserProfile = async () => {
    const docRef = doc(db, "users", userId); // Make sure userId is the correct variable name
    try {
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hooks...

 

const storage = getStorage();
const pathReference = ref(storage, 'Black Key/Assistant.jpg');

getDownloadURL(pathReference)
  .then((url) => {
    // `url` is the download URL for the image
    console.log(url);
    // You can use this URL in an <img> tag to display the image
  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });


  // Revised rendering for user profile
  const renderUserProfile = () => {
    if (!profile) return <p>No profile data</p>;
    return (
      <div>
        <h2>{profile.name}</h2>
        <p>Email: {profile.email}</p>
        <img src={profile.profilePhotoUrl} alt="Profile" />
        {/* Display other profile details here */}
      </div>
    );
  };
    
    
      


  return (
    
    <div className={styles.container}>
      <Helmet>
        <title>User Profile</title>
        {/* Other meta tags */}
      </Helmet>

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
                  <Avatar imagePath="Black Key/Assistant.jpg" />
                  <img 
                     src={profile.profilePhotoURL ? profile.profilePhotoURL : "//gs://cuttingedgeai.appspot.com/Black Key/Assistant.jpg"} 
                     alt="User profile" 
                     className={styles.profileImage} 
                  />

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
          <Expenses/> 
         
    </div>
  
  );
}

export default User;
