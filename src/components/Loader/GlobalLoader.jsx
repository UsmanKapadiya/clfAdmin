import React from 'react';
import './GlobalLoader.css';

const GlobalLoader = ({ text = 'Loading...' }) => (
  <div className="global-loader-container">
    <div className="global-loader-spinner"></div>
    <div className="global-loader-text">{text}</div>
  </div>
);

export default GlobalLoader;
