import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../apiHandler';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

const VoiceChat = () => {
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      const peerConnection = new RTCPeerConnection(configuration);
      setPeerConnection(peerConnection);

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
        }
      };
    };

    init();
  }, []);

  useEffect(() => {
    if (localAudioRef.current && localStream) {
      localAudioRef.current.srcObject = localStream;
    }

    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  useEffect(() => {
    socket.on('answer', async (answer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });
    socket.on('offer', async (offer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
      socket.emit('answer', answer);
    });
    return () => {
      socket.off('answer');
      socket.off('offer');
    };
  }, []);

  const sendOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit('offer', offer);
  };

  return (
    <div>
      <button
        style={{ width: '100px', height: '100px' }}
        onClick={() => sendOffer}>
        Send Offer
      </button>
      <audio
        ref={localAudioRef}
        autoPlay
      />
      <audio
        ref={remoteAudioRef}
        autoPlay
      />
    </div>
  );
};

export default VoiceChat;
