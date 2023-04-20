import React, { useState } from 'react';
import { socketRequest } from '../../../apiHandler';

const ChatInput = (props) => {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    socketRequest('chatMessage', props.recipientId, message);
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
