import React, { useEffect, useState } from 'react';
import './Dds.css';
const API_URL = 'http://localhost:3000';

export const Ads = () => {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(1);

  useEffect(() => {
    const fetchedAds = async () => {
      const response = await fetch(`${API_URL}/ads`);
      const jsonResponse = await response.json();
      if (jsonResponse.success) setAds(jsonResponse.success);
    };
    fetchedAds();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAd((current) => {
        if (current + 1 > ads.length) return 1;
        return current + 1;
      });
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentAd]);

  return (
    <div className="ads">
      <div className="ad-container">
        <img
          src={ads[currentAd]}
          alt="ad"
          className="ad-image"></img>
        <div className="ad-buttons">
          {ads.map((ad, index) => {
            return (
              <button
                key={index}
                style={{ backgroundColor: currentAd === index + 1 && 'var(--color-primary-1)' }}
                onClick={() => setCurrentAd(index + 1)}></button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
