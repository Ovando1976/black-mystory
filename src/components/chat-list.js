import { useEffect, useState } from 'react';
import { Separator } from './ui/separator';
import { ChatMessage } from './chat-message';
import {getDatabase} from 'firebase/database';



export function ChatList() {
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
      // Get a reference to the database
      const db = getDatabase();
      const messagesRef = db.ref('messages');
      
      // Attach an event listener to fetch all messages and listen for new ones
      messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const newMessages = data ? Object.values(data) : [];
        setMessages(newMessages);
      });
      
      // Detach the event listener when the component is unmounted
      return () => messagesRef.off();
    }, []);
  
    if (!messages.length) {
      return null;
    }
  
    return (
      <div className="relative mx-auto max-w-2xl px-4">
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={message} />
            {index < messages.length - 1 && (
              <Separator className="my-4 md:my-8" />
            )}
          </div>
        ))}
      </div>
    );
  }