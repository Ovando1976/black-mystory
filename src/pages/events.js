import { useEffect, useState } from 'react';
import styles from './EventsPage.module.css';
import { getFirestore, collection, query, onSnapshot, addDoc } from 'firebase/firestore';
import { app } from '../Firebase/firebaseConfig'; // Make sure this path is correct

function EventsPage() {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const db = getFirestore(app); // Ensure 'app' is passed correctly
    const eventsCol = collection(db, 'events');

    const q = query(eventsCol);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsArray);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    setLoading(true);
    try {
      const db = getFirestore(app); // Ensure 'app' is passed correctly
      await addDoc(collection(db, 'events'), eventData);
      setEventData({ title: '', date: '', time: '', location: '', description: '' });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.eventsContainer}>
      <div>
        <title>Events - Your Site Name</title>
        <meta name="description" content="Upcoming events list" />
      </div>

      {/* Events List */}
      <div className={styles.eventsList}>
        {loading ? <p>Loading...</p> : events.map(event => (
          <div key={event.id} className={styles.eventCard}>
            <h2>{event.title}</h2>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.addEventForm}>
  <h2>Add Event</h2>
  {error && <p className={styles.error}>{error}</p>}

  {/* Title Input */}
  <input
    type="text"
    name="title"
    placeholder="Title"
    value={eventData.title}
    onChange={handleInputChange}
    className={styles.inputField} // Add your CSS class for styling
  />

  {/* Date Input */}
  <input
    type="date"
    name="date"
    placeholder="Date"
    value={eventData.date}
    onChange={handleInputChange}
    className={styles.inputField}
  />

  {/* Time Input */}
  <input
    type="time"
    name="time"
    placeholder="Time"
    value={eventData.time}
    onChange={handleInputChange}
    className={styles.inputField}
  />

  {/* Location Input */}
  <input
    type="text"
    name="location"
    placeholder="Location"
    value={eventData.location}
    onChange={handleInputChange}
    className={styles.inputField}
  />

  {/* Description Textarea */}
  <textarea
    name="description"
    placeholder="Description"
    value={eventData.description}
    onChange={handleInputChange}
    className={styles.textArea} // Add your CSS class for styling
  />
  </div>
      <div className={styles.addEventForm}>
        <h2>Add Event</h2>
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={handleAddEvent} disabled={loading} className={styles.submitButton}>
        Add Event
       </button>
      </div>
    </div>
  );
}

export default EventsPage;


