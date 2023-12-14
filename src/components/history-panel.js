import React, { useState, useEffect } from 'react';
import { getFirestore } from "firebase/firestore";

function HistoryPanel() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  async function getPastSessions() {
    try {
        const db = getFirestore();
        const sessionsRef = db.collection("sessions");
        const snapshot = await sessionsRef.get();

        if (snapshot.empty) {
            console.log('No sessions found.');
            return [];
        }  

        let sessions = [];
        snapshot.forEach(doc => {
            sessions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return sessions;

    } catch (error) {
        console.error("Error fetching sessions: ", error);
        setError("Unable to fetch sessions.");
    }
  }

  async function getMessagesForSession(sessionId) {
    try {
        if (!sessionId) {
            throw new Error("Session ID is required.");
        }

        const db = getFirestore();
        const messagesRef = db.collection("messages").where("sessionId", "==", sessionId);
        const snapshot = await messagesRef.get();

        if (snapshot.empty) {
            console.log('No messages found for this session.');
            return [];
        }

        let messages = [];
        snapshot.forEach(doc => {
            messages.push(doc.data());
        });

        return messages;

    } catch (error) {
        console.error("Error fetching messages for session: ", error);
        setError("Unable to fetch messages for the session.");
    }
  }

  useEffect(() => {
    const fetchSessions = async () => {
      const retrievedSessions = await getPastSessions();
      setSessions(retrievedSessions);
    };

    fetchSessions();
  }, []);

  const handleSessionChange = async (sessionId) => {
    const retrievedMessages = await getMessagesForSession(sessionId);
    setSelectedSession(sessionId);
    setMessages(retrievedMessages);
  };

  return (
    <div>
        {/* Display any error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* List of Sessions */}
        <div>
            <h2>Sessions</h2>
            <ul>
                {sessions.map(session => (
                    <li key={session.id}>
                        <button onClick={() => handleSessionChange(session.id)}>
                            Session: {session.id}
                        </button>
                    </li>
                ))}
            </ul>
        </div>

        {/* Display Messages of a Selected Session */}
        <div>
            <h2>Messages for Session: {selectedSession}</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {message.content}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
}

export default HistoryPanel;