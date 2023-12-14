import React, { useEffect, useState } from 'react'; // Ensure React and hooks are imported
import { ref, onValue, off, set, serverTimestamp, getDatabase } from 'firebase/database'; 
import { cn } from '../lib/utils';
import { MemoizedReactMarkdown } from './markdown';
import { IconOpenAI, IconUser } from '../components/ui/icons';
import { ChatMessageActions } from './chat-message-actions';

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
    try {
      const newMessageRef = ref(database, `sessions/${sessionId}/messages`).push();
      await set(newMessageRef, {
        text,
        role,
        createdAt: serverTimestamp()
      });
      return newMessageRef.key;
    } catch (error) {
      console.error("Error adding message:", error);
      return null;
    }
  };

  return { messages, addMessage };
};

const ChatComponent = ({ sessionId }) => {
  const { messages, addMessage } = useChatMessages(sessionId);

  const sendMessage = () => {
    addMessage("Hello, world!", "user");
  };

  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}>{message.text}</p>
      ))}
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export function ChatMessage({ message }) {  // <-- Ensure message is passed as a prop
  return (
    <div className={cn('group relative mb-4 flex items-start md:-ml-12')}>
      <div className={cn(
        'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
        message.role === 'user'
          ? 'bg-background'
          : 'bg-primary text-primary-foreground'
      )}>
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[/* your plugins here */]}
          components={{ /* your components here */ }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}

export default ChatComponent;  // You might want to export your ChatComponent too.

