const { getFirestore, collection, addDoc } = require('firebase/firestore');
const db = getFirestore();

const createPost = async (postData) => {
  try {
    const postRef = await addDoc(collection(db, 'posts'), {
      userID: postData.userID,
      description: postData.description,
      image: postData.image || '',
      likes: postData.likes || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return postRef.id; // returns the created document's ID
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

module.exports = { createPost };
