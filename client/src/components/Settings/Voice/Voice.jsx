import React, { useContext, useEffect, useState } from 'react';
import { ImRadioUnchecked, ImRadioChecked } from 'react-icons/im';
import { useSelector } from 'react-redux';
import MicTest from './MicTest';
import { AuthContext } from '../../../App';

const Voice = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const [isListenerActive, setIsListenerActive] = useState(false);
  const [voiceObject, setVoiceObject] = useState(voiceSettings);
  const { useApi, useSocket, socket } = useContext(AuthContext);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isListenerActive) {
        setVoiceObject((current) => ({ ...current, key: event.key }));
        setIsListenerActive(false);
      }
    };
    if (isListenerActive) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListenerActive]);

  return (
    <>
      <div className="settings-profile-container">
        <div className="voice-field-container">
          <p className="voice-settings-label">Incoming Volume</p>
          <div className="volume-slider-container">
            <input
              className="slider"
              type="range"
              min="1"
              max="100"
              value={voiceObject.volume}
              onChange={(e) => setVoiceObject((current) => ({ ...current, volume: e.target.value }))}
            />
            <p>{voiceObject.volume}</p>
          </div>
        </div>
        <span style={{ marginBottom: '0.5em' }}></span>
        <div className="voice-field-container">
          <p className="voice-settings-label">Input Mode</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              className="voice-button"
              onClick={() => setVoiceObject((current) => ({ ...current, inputMode: 'push' }))}>
              {voiceObject.inputMode === 'push' ? <ImRadioChecked style={{ marginRight: '0.5em' }} /> : <ImRadioUnchecked style={{ marginRight: '0.5em' }} />}
              Push To Talk
            </button>
            <button
              className="voice-button"
              onClick={() => setVoiceObject((current) => ({ ...current, inputMode: 'continuous' }))}>
              {voiceObject.inputMode === 'continuous' ? <ImRadioChecked style={{ marginRight: '0.5em' }} /> : <ImRadioUnchecked style={{ marginRight: '0.5em' }} />}
              Continuous Transmission
            </button>
          </div>
          {voiceObject.inputMode === 'push' && (
            <div
              className="settings-profile-field"
              style={{ width: '100%' }}>
              <h1 style={{ whiteSpace: 'nowrap' }}>Push To Talk Key:</h1>
              <p style={{ color: !isListenerActive ? 'white' : 'indianred' }}>{!isListenerActive ? voiceObject.key : 'Press a Key'}</p>
              <button onClick={() => setIsListenerActive(true)}>EDIT</button>
            </div>
          )}
        </div>
        <span style={{ marginBottom: '0.5em' }}></span>
        <MicTest></MicTest>
        <button
          className="mic-test-button"
          onClick={() => useSocket(`user:changeVoiceSettings`, voiceObject)}>
          SAVE CHANGES
        </button>
      </div>
    </>
  );
};

export default Voice;
