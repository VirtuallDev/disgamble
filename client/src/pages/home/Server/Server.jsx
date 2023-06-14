import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { GiSpeaker } from 'react-icons/gi';
import { HiHashtag } from 'react-icons/hi';
import './server.css';

const Server = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const [dragging, setDragging] = useState('');
  const [isInDropZone, setIsInDropZone] = useState(null);

  const handleDrop = (id) => {
    setIsInDropZone(null);
    console.log(`Move user ${dragging} to channel ${id}`);
  };

  return (
    <div className="server-channels-container">
      {[
        { id: 1, type: 'voice', name: 'Voice', users: [userInfo, userInfo, userInfo] },
        { id: 2, type: 'text', name: 'Text' },
      ].map((channel, index) => (
        <div
          className="channel-container"
          key={index}>
          {channel.type === 'text' ? (
            <div className="channel">
              <HiHashtag
                size={'1.6em'}
                color={'inherit'}
              />
              {channel.name}
            </div>
          ) : (
            <>
              <div
                className="channel"
                onDragEnter={() => setIsInDropZone(channel.id)}
                onDragLeave={() => setIsInDropZone(null)}
                onDrop={() => handleDrop(channel.id)}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  opacity: isInDropZone === channel.id ? '0.5' : '1',
                  border: isInDropZone === channel.id ? '3px double green' : 'lightgray',
                }}>
                <GiSpeaker
                  size={'1.7em'}
                  color={'inherit'}
                />
                {channel.name}
              </div>
              {channel.users.map((user, index) => (
                <div
                  key={index}
                  className="channel-user"
                  draggable
                  onDragStart={() => setDragging(user.userId)}
                  onDragEnd={() => setDragging('')}>
                  <img
                    src={user.image}
                    alt=""
                  />
                  User {user.name}
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Server;
