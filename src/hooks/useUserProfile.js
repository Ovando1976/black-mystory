import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function User() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = "your_user_id_here"; // Replace this with the actual user ID

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const docRef = doc(db, "users", userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserProfile(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user profile: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!userProfile) {
        return <div>No profile data available</div>;
    }

    return (
        <div>
            <h1>{userProfile.name}</h1>
            <p>Email: {userProfile.email}</p>
            {/* Display other user profile details here */}
            <img src={userProfile.profilePhotoUrl} alt="Profile" />
        </div>
    );
}

export default User;
