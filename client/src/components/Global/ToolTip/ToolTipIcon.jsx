import React from 'react';
import './ToolTipIcon.css';

const ToolTipIcon = ({ handler = () => {}, tooltip, icon = undefined, direction = 'top', width = '2.5em', height = '2.5em' }) => {
  return (
    <div
      className="tooltip-icon-container"
      style={{ width: width, height: height }}
      onClick={(e) => {
        handler();
        e.stopPropagation();
      }}>
      <p className={`tooltip-text ${direction}`}>{tooltip}</p>
      {icon}
    </div>
  );
};

export default ToolTipIcon;
