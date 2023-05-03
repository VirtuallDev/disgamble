import React, { useState } from 'react';
import useAuth from '../../customhooks/useAuth';

const ChatInput = (props) => {
  const [message, setMessage] = useState('');
  const { useApi, useSocket, socket } = useAuth();

  const sendMessage = async () => {
    useSocket('chat:message', props.recipientId, message);
  };

  return (
    <div>
      <input
        className="chat-input"
        type="text"
        onChange={(e) => {
          setMessage(e.target.value);
        }}></input>
      <button
        className="send-button"
        onClick={() => sendMessage()}>
        Send Message
      </button>
    </div>
  );
};

export default ChatInput;
