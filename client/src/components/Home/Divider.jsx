import React from "react";
import './Divider.css';

export const Divider = ({m, p}) => {
    return (
        <div className="hr-div" style={{marginBlock: m, padding: p}} />
    )
}