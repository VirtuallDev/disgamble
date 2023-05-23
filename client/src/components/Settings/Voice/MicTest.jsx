import React, { useEffect, useState, useRef } from 'react';

const MicTest = () => {
  const [stream, setStream] = useState(null);
  const [micLevel, setMicLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef(null);

  const init = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      setStream(null);
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!newStream) return;
      setStream(newStream);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!stream || !isActive) return setMicLevel(0); // Stop updating micLevel if test is not active
    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    sourceNode.connect(analyserNode);

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    const getAudioVolume = () => {
      analyserNode.getByteFrequencyData(dataArray);
      const total = dataArray.reduce((acc, val) => acc + val, 0);
      const average = total / dataArray.length;
      return average;
    };

    const updateMicLevel = () => {
      const audioVolume = getAudioVolume();
      setMicLevel(audioVolume);
    };

    const interval = setInterval(updateMicLevel, 16);

    return () => {
      clearInterval(interval);
      audioContext.close();
    };
  }, [stream, isActive]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      <div className="mic-test-container">
        <p className="voice-settings-label">Microphone Test</p>
        <div className="mic-level-parent">
          <div class="mic-level-wrapper">
            <div class="mic-level-container">
              <div
                className="mic-level"
                style={{ width: `${(micLevel / 255) * 100}%` }}></div>
            </div>
          </div>
          <button
            className="mic-test-button"
            onClick={() => setIsActive((current) => !current)}>
            {isActive ? 'STOP TEST' : 'BEGIN TEST'}
          </button>
        </div>
      </div>
      <audio
        ref={audioRef}
        muted={!isActive}
        autoPlay
      />
    </>
  );
};

export default MicTest;
