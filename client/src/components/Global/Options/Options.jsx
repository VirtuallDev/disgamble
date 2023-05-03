import React, { useEffect, useRef, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import './options.css';

const Options = ({ currentValue, buttons, object }) => {
  const optionsRef = useRef(null);
  const [currentOption, setCurrentOption] = useState('');

  useEffect(() => {
    window.addEventListener('mousedown', (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setCurrentOption('');
      }
    });
    return () => {
      window.removeEventListener('mousedown', (e) => {
        if (optionsRef.current && !optionsRef.current.contains(e.target)) {
          setCurrentOption('');
        }
      });
    };
  }, []);
  return (
    <div
      className="dots-options"
      onClick={(e) => {
        e.stopPropagation();
        setCurrentOption(currentValue);
      }}>
      <div
        ref={optionsRef}
        className="dots-options-container"
        style={{ display: currentOption === currentValue ? 'initial' : 'none' }}>
        {buttons.map((button, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                button.handler(object);
                setCurrentOption('');
              }}
              style={{ color: button.color }}>
              {button.name}
            </button>
          );
        })}
      </div>
      <HiDotsVertical
        size={'1.5em'}
        color={'var(--gray-2)'}></HiDotsVertical>
    </div>
  );
};

export default Options;
