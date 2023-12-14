const { getFirestore, collection, addDoc } = require('firebase/firestore');
const db = getFirestore();

const createUser = async (userData) => {
  try {
    const userRef = await addDoc(collection(db, 'users'), {
      username: userData.username,
      email: userData.email,
      password: userData.password, // Ensure this is securely hashed
      profilePicture: userData.profilePicture || '',
      coverPicture: userData.coverPicture || '',
      followers: userData.followers || [],
      following: userData.following || [],
      isAdmin: userData.isAdmin || false,
      description: userData.description || '',
      city: userData.city || '',
      from: userData.from || '',
      relationship: userData.relationship,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return userRef.id; // Returns the created document's ID
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

module.exports = { createUser };
