// Define your action types
var ADD_MESSAGE = 'ADD_MESSAGE';
var SET_ERROR = 'SET_ERROR';
var INITIALIZE_CONVERSATIONS = 'INITIALIZE_CONVERSATIONS';
var GET_CHATS = 'GET_CHATS';  // New action type

// Action creators
function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    payload: message
  };
}

function setError(error) {
  return {
    type: SET_ERROR,
    payload: error
  };
}

function initializeConversations() {
  return {
    type: INITIALIZE_CONVERSATIONS
  };
}

function getChats(chats) {  // New action creator
  return {
    type: GET_CHATS,
    payload: chats
  };
}

// Export the action creators and types
module.exports = {
  ADD_MESSAGE: ADD_MESSAGE,
  SET_ERROR: SET_ERROR,
  INITIALIZE_CONVERSATIONS: INITIALIZE_CONVERSATIONS,
  GET_CHATS: GET_CHATS,
  addMessage: addMessage,
  setError: setError,
  initializeConversations: initializeConversations,
  getChats: getChats
};
