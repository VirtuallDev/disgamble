import React, { useEffect, useRef, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import './options.css';
import ToolTipIcon from '../ToolTip/ToolTipIcon';

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
    <>
      <div style={{ position: 'relative' }}>
        <ToolTipIcon
          handler={() => setCurrentOption(currentValue)}
          tooltip={'More'}
          icon={
            <HiDotsVertical
              size={'1.8em'}
              color={'white'}></HiDotsVertical>
          }
          direction="left"
          height="2em"
          width="1.5em">
          <HiDotsVertical
            size={'1.5em'}
            color={'var(--gray-2)'}></HiDotsVertical>
        </ToolTipIcon>
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
      </div>
    </>
  );
};

export default Options;
