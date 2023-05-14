import React, { useEffect, useRef, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import './dropdown.css';

const DropDown = ({ value, setValue, name, options }) => {
  const optionsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      <div
        className="dropdown-container"
        ref={optionsRef}>
        <button
          className="dropdown-button"
          onClick={() => setIsOpen((prev) => !prev)}>
          {name}
          <RiArrowDropDownLine
            className="dropdown-svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            color={'inherit'}
            size={'2.8em'}></RiArrowDropDownLine>
        </button>
        <div
          className="dropdown-options"
          style={{ display: isOpen ? 'flex' : 'none' }}>
          {options.map((option, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setValue(option);
                  setIsOpen(false);
                }}
                className="dropdown-option"
                style={{ backgroundColor: value === option ? 'var(--bg-primary-3)' : '' }}>
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default DropDown;
