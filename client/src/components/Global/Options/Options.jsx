import React, { useEffect, useRef, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import ToolTipIcon from '../ToolTip/ToolTipIcon';
import './options.css';

const Options = ({ currentValue, buttons, object }) => {
  const optionsRef = useRef(null);
  const [currentOption, setCurrentOption] = useState('');

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) setCurrentOption('');
    };
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      <div style={{ position: 'absolute', right: '0.2em', top: '0.2em' }}>
        <div
          style={{ position: 'relative' }}
          ref={optionsRef}>
          <ToolTipIcon
            handler={() => setCurrentOption(currentValue === currentOption ? '' : currentValue)}
            tooltip={'More'}
            icon={
              <HiDotsVertical
                style={{ transform: 'rotate(90deg)' }}
                size={'1.8em'}
                color={'white'}></HiDotsVertical>
            }
            direction="left"
            height="1.5em"
            width="2em">
            <HiDotsVertical
              size={'1.5em'}
              color={'var(--gray-2)'}></HiDotsVertical>
          </ToolTipIcon>

          <div className={`dots-options-container ${currentOption === currentValue ? 'show' : 'hide-down'}`}>
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
      </div>
    </>
  );
};

export default Options;
