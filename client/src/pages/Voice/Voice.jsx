import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../apiHandler';
import { useSelector } from 'react-redux';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

const Voice = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userId } = userObject;

  const remoteAudioRef = useRef(null);

  const [peerConnection, setPeerConnection] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connection, setConnection] = useState(null);

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
        }
      };

      peerConnection.onopen = () => {
        setConnection('Connection Established');
      };

      socket.on('answer', async (answer, id) => {
        if (userId !== id && peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });
      socket.on('offer', async (offer, id) => {
        if (userId !== id && peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
          socket.emit('answer', answer);
        }
      });
      return () => {
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

  const sendOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit('offer', offer);
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
        <div style={{ color: 'white' }}>{connection}"Connection"</div>
      </div>
    </>
  );
};

export default Voice;
