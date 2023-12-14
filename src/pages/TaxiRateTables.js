import React, { useEffect, useState } from "react";
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { app } from '../Firebase/firebaseConfig';

// Initialize Firestore through Firebase

const db = getFirestore(app);

function TaxiRateTables() {
  const [taxiRates, setTaxiRates] = useState([]);
  
  function parseHTML(htmlContent) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(htmlContent);
    const parsedTaxiRates = []; // Renamed to avoid confusion with state variable
    
    $('table').each((i, table) => {
      const headers = $(table).find('th').map((i, th) => $(th).text().trim()).get();
      
      $(table).find('tr').slice(1).each((i, row) => {
        const data = $(row).find('td').map((i, td) => $(td).text().trim()).get();
        const taxiRate = {};
        headers.forEach((header, index) => {
          taxiRate[header] = data[index];
        });
        parsedTaxiRates.push(taxiRate);
      });
    });
    
    return parsedTaxiRates;
  }

  async function uploadTaxiRates(parsedRates) {
    return Promise.all(parsedRates.map(async (rate) => {
      await addDoc(collection(db, 'taxiRates'), rate);
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'taxiRates'));
        const fetchedTaxiRates = querySnapshot.docs.map(doc => doc.data());
        setTaxiRates(fetchedTaxiRates);
      } catch (error) {
        console.error('Error fetching taxi rates:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch and parse HTML data
  useEffect(() => {
    fetch('/taxi_rates.html')
      .then(response => response.text())
      .then(htmlContent => parseHTML(htmlContent))
      .then(parsedRates => uploadTaxiRates(parsedRates))
      .then(() => console.log('Taxi rates uploaded successfully!'))
      .catch(error => console.error('Error uploading taxi rates:', error));
  }, []);

  return (
    <div>
      <h2>St. Thomas Taxi Rate Tables</h2>
      <h3>HOTELS TO/FROM</h3>
      <table>
        <tbody>
          {taxiRates.map((taxiRate, index) => (
            <tr key={index}>
              <td>{taxiRate.from}</td>
              <td>{taxiRate.to}</td>
              <td>${taxiRate.price1}</td>
              <td>${taxiRate.price2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaxiRateTables;
