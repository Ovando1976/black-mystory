import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { initializeApp} from 'firebase/app';
import { app} from '../Firebase/firebaseConfig';
import styles from './Home.module.css';
import Featured from "../components/featured/Featured";
import FeaturedProperties from "../components/featuredProperties/FeaturedProperties";
import Header from "../components/header/Header";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import MailList from "../components/mailList/MailList";
import PropertyList from "../components/propertyList/PropertyList";
import "./Home.module.css";
import styled, { keyframes } from 'styled-components';
import axios from 'axios';


const float = keyframes`
  0% {
    transform: translate(0, 0px);
  }
  50% {
    transform: translate(0, 50px);
  }
  100% {
    transform: translate(0, 0px);
  }
`;

const FloatingImage = styled.img`
  animation: ${float} 3s ease-in-out infinite;
`;


// Initialize Firestore and collections

const db = getFirestore(app);
const messagesCollection = collection(db, 'sessions', 'YOUR_SESSION_ID', 'messages');


const useChatMessages = (sessionId) => {
  const [messages, setMessages] = useState([]);
// Function for fetching chat history from Firestore
async function getChatHistory() {
  const messagesSnapshot = await getDocs(messagesCollection);
  const messages = messagesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return messages;
}

// Function for adding messages to Firestore
async function addMessage(text, role) {
  await addDoc(messagesCollection, {
    text,
    role,
    timestamp: new Date().toISOString(),
  });
}


const ChatComponent = ({ sessionId }) => {
  const [input, setInput] = useState('');
  const { messages, addMessage } = useChatMessages(sessionId);

  const handleSendMessage = async () => {
    const currentInput = input;
    const messageId = await addMessage(currentInput, 'user');
    setInput('');
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: currentInput })
    });
    const data = await response.json();
    const responseId = await addMessage(data.message, 'bot');
    return { messageId, responseId };
  };
  

  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}>{message.text}</p>
      ))}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};


const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button type="submit">Send</button>
    </form>
  );
}};




function Home() {

    const [posts, setPosts]=useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const handlePersonaSelection = (persona) => {
    setSelectedPersona(persona);
  };

  const PersonaCard = ({ persona, onClick }) => (
    <div className="persona-card" onClick={onClick}>
      <h3>{persona}</h3>
      <p>A brief description of the persona and their travel preferences.</p>
    </div>)
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // Function to handle sending messages and getting responses
  const handleSendMessage = async (message) => {
    try {
        // Send message to your server endpoint
        const response = await axios.post('/api/chat/completions', { message });
        // Update your chat with the response
        const botResponse = response.data;
        // Add botResponse to your chat
    } catch (error) {
        console.error('Error in getting response:', error);
    }
};

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (input.trim() === '') return;

    // Add the user message to the conversation
    const userMessage = { sender: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    // Frontend code
    

    const API_URL = 'http://localhost:8080/api/chat/completions'; // Update with actual URL

    async function getChatCompletion(message) {
      try {
    const response = await axios.post(API_URL, { message });
      return response.data;
    } catch (error) {
      console.error(error);
    // Handle error
    }
    }


    // Get the chatbot response
    const response = await getChatbotResponse(input);

    // Add the bot message to the conversation
    const botMessage = { sender: 'bot', content: response };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    // Clear the input
    setInput('');
  };

  const getChatbotResponse = async (input) => {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.Openai_Api_Key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: input }],
        max_tokens: 100,
      }),
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', options);
      const data = await response.json();
      return data.choices[0].text;
    } catch (error) {
      console.error(error);
      return 'An error occurred while fetching the chatbot response.';
    }
  };
// Function to generate a response from OpenAI's GPT model
async function generateAIResponse(message) {
  const openAIResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo', // or another model of your choice
    messages: [{ role: 'user', content: message }]
  });
  
  // Log the response
  console.log("OpenAI Response:", openAIResponse.data);

  return openAIResponse.data;
}

// Endpoint to handle chat completions
app.post('/api/chat/completions', cors(), async (req, res) => {
  const message = req.body.message;

  try {
    const response = await generateAIResponse(message);
    
    // Log the response
    console.log("Response to be sent:", response);

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating response' });
  }
});

const fetchPosts = async () => {
  try {
    const response = await axios.get('https://localhost:8080/api/news'); // Update URL
    setPosts(response.data);
  } catch (error) {
    console.error(error);
    // Handle error
  }
};


const fetchHistory = async () => {
  try {
    const response = await axios.get('https://localhost:8080/api/history'); // Update URL
    // Update messages based on your history data format
    setMessages(response.data);
  } catch (error) {
    console.error(error);
    // Handle error
  }
};


const ChatBot = () => {

}
    return (
        <>
        <div>
          
            <h1>Welcome to the USVI Explorer</h1>
            <p>This is the home page. Navigate through the links in the navbar to explore other sections.</p>
        </div>
        <>
      <div>
        <div>
        <div className="welcome-container">
        <h1>Welcome to Your U.S. Virgin Islands Virtual Travel Companion App!</h1>
        <p>Please create an account or sign in to continue.</p>
        <button>Create Account</button>
        <button>Sign In</button>
        <hr />
        <h2>Choose your travel persona:</h2>
        <div className="personas-container">
          <PersonaCard
            persona="The Family Adventurer"
            onClick={() => handlePersonaSelection("The Family Adventurer")}
          />
          <PersonaCard
            persona="The Romantic Escape Seekers"
            onClick={() => handlePersonaSelection("The Romantic Escape Seekers")}
          />
          <PersonaCard
            persona="The Eco-Conscious Explorers"
            onClick={() => handlePersonaSelection("The Eco-Conscious Explorers")}
          />
          <PersonaCard
            persona="The Cultural Enthusiasts"
            onClick={() => handlePersonaSelection("The Cultural Enthusiasts")}
          />
        </div>
        {selectedPersona && (
          <div>
            <h2>Welcome, {selectedPersona}!</h2>
            <p>Let&apos;s start customizing your travel experience.</p>
            <button>Next</button>
          </div>
        )}
      </div>
  
        </div>
        <div>
          <FloatingImage
            className="relative"
          />
          <p>
            <a href="https://giphy.com/gifs/beach-boys-uLlFhMKbxgMzm">via GIPHY</a>
          </p>
        </div>
        <div>
  
  
  
          {/* Conversation history panel */}
          <div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.sender === 'user' ? 'text-blue-500' : 'text-green-500'}
              >
                {message.content}
              </div>
            ))}
          </div>
        </div>
        <div>
        <iframe src="https://giphy.com/embed/uLlFhMKbxgMzm" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/beach-boys-uLlFhMKbxgMzm">via GIPHY</a></p>
        </div>
            <p>
            <a href="https://giphy.com/gifs/beach-boys-uLlFhMKbxgMzm">via GIPHY</a>
            </p>
        <div>
          {/* Conversation history panel */}
          <div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.sender === 'user' ? 'text-blue-500' : 'text-green-500'}
              >
                {message.content}
              </div>
            ))}
          </div>
        </div>
        <div>
          <iframe
            width="560"
            height="315"
            src="https://youtube.com/embed/Z3OK9cy4ReU"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  
            
  allowFullScreen
          ></iframe>
  
        
  </div>
        <div>
          {/* Converstion history panel*/}
          <div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.sender === 'user' ? 'text-blue-500' : 'text-green-500'}
              >
                {message.content}
              </div>
            ))}
          </div>
          {/* Input container */}
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
        <div className={styles.container}>
        <main className={styles.content}>
           {/* Added ChatComponent with a placeholder sessionId */}
           <div className="homeContainer">
        <Featured/>
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList/>
        <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperties/>
        <MailList/>
      </div>
        </main>
      </div>
      </div>
      <Footer/>
  </>
  );
</>
);
}

export default Home;
