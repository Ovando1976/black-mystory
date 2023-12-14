import React, { useEffect, useState } from 'react';
import styles from './groups.module.css'; // Assuming you use CSS Modules for styling
import { getFirestore, collection, addDoc, doc, updateDoc, query, onSnapshot } from 'firebase/firestore';
import { app } from '../Firebase/firebaseConfig'; // Your Firebase initialization file
import { runTransaction } from 'firebase/firestore';

const db = getFirestore(app);
const cardStyle = {
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  borderRadius: '5px',
  padding: '20px',
  margin: '100px ',
  margininsetInlineStart: '20px',
  margininsetInlineEnd: '20px',
  maxinlineSize: '800px',
  backgroundColor: '#fff'
};

function GroupsCard({ group }) {
  return (
    <div className={styles.groupsCard} onClick={() => {/* Navigate to group details */}}>
      <h2>{group.title}</h2>
      <p>Location: {group.location}</p>
      <p>{group.description}</p>
    </div>
  );
}

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'groups'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groupsArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setGroups(groupsArray);
      setLoading(false);
    }, err => {
      setError('Failed to fetch groups.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createGroup = async () => {
    // Code to create a group
    const newGroup = {
      // Define group properties
      title: 'New Group',
      location: 'Location',
      description: 'Description',
      memberCount: 1,
      // Add other group fields
    };

    try {
      await addDoc(collection(db, 'groups'), newGroup);
      // Handle success (e.g., show success message or navigate to the group page)
    } catch (err) {
      console.error('Error creating group:', err);
      // Handle error (e.g., show error message)
    }
  };

  const joinGroup = async (groupID) => {
    const groupRef = doc(db, 'groups', groupID);
  
    try {
      await runTransaction(db, async (transaction) => {
        const groupDoc = await transaction.get(groupRef);
        if (!groupDoc.exists()) {
          throw "Group does not exist!";
        }
  
        const newMemberCount = (groupDoc.data().memberCount || 0) + 1;
        transaction.update(groupRef, { memberCount: newMemberCount });
      });
  
      // Handle success (e.g., show success message)
    } catch (err) {
      console.error('Error joining group:', err);
      // Handle error (e.g., show error message)
    }
  };

  

  return (
    <div className={styles.groupsContainer}>

      <div>
        <title>Groups - Your Website Name</title>
        <meta name="description" content="Join groups of your interest and connect with like-minded people." />
        {/* Additional meta tags for SEO can be added here */}
      </div>

      <h1 className={styles.header}>Discover Groups</h1>
      <button className={styles.createGroupButton}>Create New Group</button>

      {loading && <p>Loading groups...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.groupsList}>
        {groups.map(group => (
          <div key={group.id} className={styles.groupCard}>
            <img src={group.image} alt={group.name} className={styles.groupImage} />
            <h2>{group.name}</h2>
            <p>Members: {group.memberCount}</p>
            <p>{group.description}</p>
            <button className={styles.joinButton}>Join Group</button>
            {/* Additional group details and functionalities can be added */}
          </div>
        ))}
      </div>
      
      {/* Pagination, search, filters, etc. can be added below */}
    </div>
  );
}

export default Groups;
