import React, { useState } from 'react';
import { db } from '../Firebase/firebaseConfig';  // Assuming you've initialized Firebase in a 'firebase.js' file



function Driver() {
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [license, setLicense] = useState('');
  const [status, setStatus] = useState('available'); // or 'on_trip'

  const handleProfileUpdate = async () => {
    try {
      // Assuming you have a 'drivers' collection in Firestore
      const driverRef = db.collection('drivers').doc(license);  // Using license as a unique ID

      // Save/update the driver profile
      await driverRef.set({
        name,
        vehicle,
        license,
        status
      });

      // Implement verification logic for license and other documents
      // ... 

      alert('Profile updated successfully!');

    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div>
      <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
      <input type="text" placeholder="Vehicle" onChange={e => setVehicle(e.target.value)} />
      <input type="text" placeholder="License" onChange={e => setLicense(e.target.value)} />
      <p>Status: {status}</p>
      <button onClick={handleProfileUpdate}>Update Profile</button>
    </div>
  );
}

export default Driver;