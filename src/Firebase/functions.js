import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const db = getFirestore();
const functions = getFunctions();

// Function to add a document to a Firestore collection
export const addDocumentToCollection = async (collectionName, documentData) => {
  try {
    const docRef = await db.collection(collectionName).add(documentData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Function to fetch a document from a Firestore collection
export const fetchDocumentFromCollection = async (collectionName, documentId) => {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data();
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Function to update a document in a Firestore collection
export const updateDocumentInCollection = async (collectionName, documentId, updatedData) => {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    await docRef.update(updatedData);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Function to call a Firebase Cloud Function
export const callFirebaseFunction = async (functionName, data) => {
  try {
    const functionRef = httpsCallable(functions, functionName);
    const response = await functionRef(data);
    return response.data;
  } catch (error) {
    console.error(`Error calling function ${functionName}:`, error);
    throw error;
  }
};

