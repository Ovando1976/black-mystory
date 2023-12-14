import React, { useState } from 'react';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../Firebase/firebaseConfig';
import TaxiRateTables from './TaxiRateTables';
import styles from './Booking.module.css';


const card = document.getElementById('booking-card');
const form = document.getElementById('booking-form');


function Booking() {
  
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [carType, setCarType] = useState('sedan');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.pickup = pickup ? "" : "Pick-up location is required.";
    tempErrors.dropoff = dropoff ? "" : "Drop-off location is required.";
    tempErrors.carType = carType ? "" : "Car type is required.";
    tempErrors.sameLocation = pickup !== dropoff ? "" : "Pick-up and Drop-off locations can't be the same.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const db = getFirestore(app);
  const auth = getAuth(app);

  const resetForm = () => {
    setPickup('');
    setDropoff('');
    setCarType('sedan');
  };

  const [modalContent, setModalContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleBooking = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    if (!pickup || !dropoff || !carType) {
      alert('Please fill out all fields.');
      return;
    }

    if (pickup === dropoff) {
      alert("Pick-up and Drop-off locations can't be the same.");
      return;
    }

    setLoading(true);
    try {
      await db.collection('bookings').add({
        userId: auth.currentUser.uid,
        pickup,
        dropoff,
        carType,
        timestamp: serverTimestamp()
      });
      alert('Booking successful!');
      resetForm();
    } catch (error) {
      alert('Error booking: ' + error.message);
    } finally {
      setLoading(false);
    }

    try {
      // ... existing try block
      setModalContent('Booking successful!');
      setShowModal(true);
    } catch (error) {
      setModalContent(`Error booking: ${error.message}`);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.booking-card}>
      <h2>Book a Ride</h2>
      <TaxiRateTables />
      <div>
      <h2>St. Thomas Taxi Rate Tables</h2>
      <h3>HOTELS TO/FROM</h3>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>1 Person</th>
            <th>2+/PP (Same Group)</th>
          </tr>
        </thead>
        <tbody>
          {/* ... Add hotel rate data here ... */}
        </tbody>
      </table>
      <h3>MISCELLANEOUS TO/FROM</h3>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>1 Person</th>
            <th>2+/PP (Same Group)</th>
          </tr>
        </thead>
        <tbody>
          {/* ... Add miscellaneous rate data here ... */}
        </tbody>
      </table>
      {/* ... Booking form elements ... */}
    </div>
      <form onSubmit={handleBooking} className={styles.booking-form}>
        <div style={{ margininsetBlockEnd: '20px' }}>
          <label>
            Pick-up Location:
            {/* Inside the return statement */}
<input
  type="text"
  value={pickup}
  placeholder="Pick-up Location"
  onChange={(e) => setPickup(e.target.value)}
  className={errors.pickup && styles.errorInput}
/>
{errors.pickup && <span className={styles.errorMessage}>{errors.pickup}</span>}
          </label>
        </div>

        <div style={{ margininsetBlockEnd: '20px' }}>
          <label>
            Drop-off Location:
{/* Inside the return statement */}
<input
  type="text"
  value={dropoff}
  placeholder="Drop-off Location"
  onChange={(e) => setDropoff(e.target.value)}
  className={errors.dropoff && styles.errorInput}
/>
{errors.pickup && <span className={styles.errorMessage}>{errors.pickup}</span>}

          </label>
        </div>

        <div style={{ margininsetBlockEnd: '20px' }}>
          <label>
            Car Type:
            <select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              aria-label="Select car type"
            >
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>

      <div className={styles.info-card}>
        <h2>About Local Taxi Services</h2>
        <p>
          This booking system connects you with local taxi drivers in your area.
          Fares are typically based on distance and time, with additional charges
          for tolls and extra passengers. Please be aware that rush hour traffic
          may affect your estimated arrival time.
        </p>
      </div>
    </div>
  );
};
export default Booking;
