import React, { useState } from 'react';
import './server.css';

const Server = () => {
  const [dragging, setDragging] = useState(false);
  const [isInDropZone, setIsInDropZone] = useState(null);

  const handleDragStart = (e) => {
    setDragging(true);
  };

  const handleDragEnd = (e) => {
    setDragging(false);
  };

  const handleDrop = (number) => {};

  return (
    <div>
      <div
        className="test"
        onDragEnter={() => setIsInDropZone(1)}
        onDragLeave={() => setIsInDropZone(null)}
        onDrop={() => handleDrop(1)}
        onDragOver={(e) => e.preventDefault()}
        style={{
          backgroundColor: isInDropZone === 1 ? 'green' : 'lightgray',
        }}>
        Channel 1
      </div>
      <div
        className="test"
        onDragEnter={() => setIsInDropZone(2)}
        onDragLeave={() => setIsInDropZone(null)}
        onDrop={() => handleDrop(2)}
        onDragOver={(e) => e.preventDefault()}
        style={{
          backgroundColor: isInDropZone === 2 ? 'green' : 'lightgray',
        }}>
        Channel 2
      </div>
      <div
        className="user"
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        User 1
      </div>
      <div
        className="user"
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        User 2
      </div>
    </div>
  );
};

export default Server;
