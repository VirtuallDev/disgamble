import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../apiHandler';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

const Voice = () => {
  const remoteAudioRef = useRef(null);

  const [userId, setUserId] = useState('1');
  const [peerConnection, setPeerConnection] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connection, setConnection] = useState('connection');

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
          socket.emit('icecandidate', event.candidate);
        }
      };

      peerConnection.onopen = () => {
        setConnection('Connection Established');
      };

      socket.on('icecandidate', (candidate, id) => {
        if (userId !== id) {
          console.log('Received ICE candidate:', candidate);
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on('answer', async (answer, id) => {
        if (userId !== id) {
          console.log('Received answer:', answer);
          console.log('peerConnection:', peerConnection);
          console.log('peerConnection.connectionState:', peerConnection.connectionState);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });
      socket.on('offer', async (offer, id) => {
        if (userId !== id) {
          console.log('Received offer:', offer);
          console.log('peerConnection:', peerConnection);
          console.log('peerConnection.connectionState:', peerConnection.connectionState);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
          socket.emit('answer', answer);
        }
      });
      return () => {
        socket.off('icecandidate');
        socket.off('answer');
        socket.off('offer');
      };
    };

    init();
  }, []);

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    console.log('peerConnection:', peerConnection);
    console.log('peerConnection.connectionState:', peerConnection?.connectionState);
    setConnection(peerConnection?.connectionState);
  }, [peerConnection?.connectionState]);

  const sendOffer = async () => {
    if (peerConnection) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
      socket.emit('offer', offer);
    }
  };

  return (
    <>
      <audio
        ref={remoteAudioRef}
        autoPlay
      />
      <div>
        <button
          style={{ width: '100px', height: '100px' }}
          onClick={sendOffer}>
          Send Offer
        </button>
        <button
          style={{ width: '100px', height: '100px' }}
          onClick={() => setUserId('2')}>
          Change Id
        </button>
        <div style={{ color: 'white' }}>{connection}</div>
      </div>
    </>
  );
};

export default Voice;
