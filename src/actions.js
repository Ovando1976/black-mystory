import { getDatabase, ref, onValue, off, remove, get } from "firebase/database";


const db = getDatabase();

export async function getChats(setChatsFunction) {
  try {
    const chatsRef = ref(db, 'chats');
    const handleDataChange = snapshot => {
      const data = snapshot.val();
      const chatArray = data ? Object.values(data) : [];
      setChatsFunction(chatArray);
    };

    onValue(chatsRef, handleDataChange);

    // Return a cleanup function to detach the listener
    return () => off(chatsRef, 'value', handleDataChange);

  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
}

export async function removeChat(chatId) {
  try {
    const chatRef = ref(db, `chats/${chatId}`);
    await remove(chatRef);
  } catch (error) {
    console.error("Error removing chat:", error);
    throw error;
  }
}

export async function shareChat(chatId) {
  try {
    const chatRef = ref(db, `chats/${chatId}`);
    const snapshot = await get(chatRef);

    const chat = snapshot.val();
    if (chat) {
      console.log(`Shared chat message: ${chat.message}`);
      return chat;
    } else {
      throw new Error("Chat not found.");
    }
  } catch (error) {
    console.error("Error sharing chat:", error);
    throw error;
  }
}
