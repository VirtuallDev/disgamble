import React, { useEffect, useState } from 'react';
import './Dds.css';

const API_URL = 'http://localhost:3000';

export const Ads = () => {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      const response = await fetch(`${API_URL}/ads`);
      const { success } = await response.json();
      if (success) setAds(success);
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const startInterval = () => {
      const newIntervalId = setInterval(() => {
        setCurrentAd((current) => {
          if (current + 1 >= ads.length) return 0;
          return current + 1;
        });
      }, 5000);
      setIntervalId(newIntervalId);
    };
    if (ads.length) {
      startInterval();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [ads]);

  const handleButtonClick = (index) => {
    setCurrentAd(index);
    clearInterval(intervalId);
    const newIntervalId = setInterval(() => {
      setCurrentAd((current) => {
        if (current + 1 >= ads.length) return 0;
        return current + 1;
      });
    }, 5000);
    setIntervalId(newIntervalId);
  };

  return (
    <div className="dds">
      <div className="dd-container">
        <img
          src={ads[currentAd]}
          alt=""
          className="dd-image"
        />
        <div className="dd-buttons">
          {ads.map((ad, index) => (
            <button
              key={index}
              style={{ backgroundColor: currentAd === index && 'var(--color-primary-1)' }}
              onClick={() => handleButtonClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
