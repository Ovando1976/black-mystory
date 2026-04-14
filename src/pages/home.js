import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import styles from './Home.module.css';
import Featured from '../components/featured/Featured';
import FeaturedProperties from '../components/featuredProperties/FeaturedProperties';
import Footer from '../components/footer/Footer';
import MailList from '../components/mailList/MailList';
import PropertyList from '../components/propertyList/PropertyList';
import './Home.module.css';

const float = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(12px);
  }
  100% {
    transform: translateY(0);
  }
`;

const FloatingDecoration = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #60a5fa, #34d399);
  opacity: 0.75;
  animation: ${float} 3s ease-in-out infinite;
`;

const PERSONAS = [
  'The Family Adventurer',
  'The Romantic Escape Seekers',
  'The Eco-Conscious Explorers',
  'The Cultural Enthusiasts',
];

const CHAT_ENDPOINT = process.env.REACT_APP_CHAT_API_URL || '/api/chat/completions';

const normalizeChatResponse = (data) =>
  data?.choices?.[0]?.message?.content ??
  data?.choices?.[0]?.text ??
  data?.message ??
  'No response generated.';

function Home() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) {
      return;
    }

    setIsSending(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', content: trimmedInput },
    ]);

    try {
      const response = await getChatbotResponse(trimmedInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: response },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'bot',
          content: 'An error occurred while fetching the chatbot response.',
        },
      ]);
    } finally {
      setIsSending(false);
    }

    setInput('');
  };

  const getChatbotResponse = async (prompt) => {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {
      throw new Error(`Chat completion failed with status ${response.status}`);
    }

    const data = await response.json();
    return normalizeChatResponse(data);
  };

  return (
    <>
      <div>
        <h1>Welcome to the USVI Explorer</h1>
        <p>This is the home page. Navigate through the links in the navbar to explore other sections.</p>
      </div>

      <div className="welcome-container">
        <h1>Welcome to Your U.S. Virgin Islands Virtual Travel Companion App!</h1>
        <p>Please create an account or sign in to continue.</p>
        <button>Create Account</button>
        <button>Sign In</button>
        <hr />

        <h2>Choose your travel persona:</h2>
        <div className="personas-container">
          {PERSONAS.map((persona) => (
            <button
              className="persona-card"
              key={persona}
              onClick={() => setSelectedPersona(persona)}
              type="button"
            >
              <h3>{persona}</h3>
              <p>A brief description of the persona and their travel preferences.</p>
            </button>
          ))}
        </div>

        {selectedPersona && (
          <div>
            <h2>Welcome, {selectedPersona}!</h2>
            <p>Let&apos;s start customizing your travel experience.</p>
            <button type="button">Next</button>
          </div>
        )}
      </div>

      <div>
        <FloatingDecoration aria-hidden="true" className="relative" />
        <p>
          <a href="https://giphy.com/gifs/beach-boys-uLlFhMKbxgMzm">via GIPHY</a>
        </p>
      </div>

      <div>
        <iframe
          src="https://giphy.com/embed/uLlFhMKbxgMzm"
          width="480"
          height="270"
          frameBorder="0"
          className="giphy-embed"
          title="Beach boys travel gif"
          allowFullScreen
        />
      </div>

      <div>
        <iframe
          width="560"
          height="315"
          src="https://youtube.com/embed/Z3OK9cy4ReU"
          title="USVI travel video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div>
        <div>
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={message.sender === 'user' ? 'text-blue-500' : 'text-green-500'}
            >
              {message.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleFormSubmit}>
          <input
            aria-label="Chat message"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message..."
          />
          <button disabled={isSending || !input.trim()} type="submit">
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      <div className={styles.container}>
        <main className={styles.content}>
          <div className="homeContainer">
            <Featured />
            <h1 className="homeTitle">Browse by property type</h1>
            <PropertyList />
            <h1 className="homeTitle">Homes guests love</h1>
            <FeaturedProperties />
            <MailList />
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Home;
