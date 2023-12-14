'use client';

import React, { useState, useEffect } from 'react'; 
import { ref, onValue, off, getDatabase } from 'firebase/database'; 

const database = getDatabase();

export const useChatMessages = (sessionId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messageRef = ref(database, `sessions/${sessionId}/messages`).orderByChild('createdAt');
    const listener = onValue(messageRef, (snapshot) => {
      const newMessages = [];
      snapshot.forEach(childSnapshot => {
        newMessages.push(childSnapshot.val());
      });
      setMessages(newMessages);
    });

    return () => off(messageRef, listener);
  }, [sessionId]);

  const addMessage = async (text, role) => {
    const newMessageRef = ref(database, `sessions/${sessionId}/messages`).push();
    await newMessageRef.set({
      text,
      role,
      createdAt: Date.now() // Use a simple timestamp for this example
    });
    return newMessageRef.key;
  };

  return { messages, addMessage };
};

const ChatComponent = ({ sessionId }) => {
  const [input, setInput] = useState(''); // Message input state
  const { messages, addMessage } = useChatMessages(sessionId);
  const [, setResponseMessage] = useState(''); // GPT's response

  const handleSendMessage = async () => {
    if (!input) return; // If input is empty, do nothing
    addMessage(input, "user"); // Add user's message to chat
    setInput(''); // Clear the input

    // Fetch response from API
    try {
      const response = await fetch('/api/Completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })
      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message);
        addMessage(data.message, "gpt"); // Add GPT's response to chat
      } else {
        console.error('Unexpected response from server:', await response.json());
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}>{message.text}</p>
      ))}
      <div>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message here"
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default ChatComponent;
