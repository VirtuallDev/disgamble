import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDeafen, toggleMute } from '../../redux/sounds';
import useAuth from '../../customhooks/useAuth';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

const Voice = () => {
  const remoteAudioRef = useRef(null);
  const soundObject = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened } = soundObject;
  const dispatch = useDispatch();
  const { useApi, useSocket, socket } = useAuth();

  const [userId, setUserId] = useState('1');
  const [peerConnection, setPeerConnection] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connection, setConnection] = useState('Initializing Peer Connection');

  const sendOffer = async () => {
    if (peerConnection && !peerConnection.localDescription) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
      useSocket('webrtc:offer', offer, userId);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const newPeerConnection = new RTCPeerConnection(configuration);
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        newStream.getAudioTracks().forEach((track) => {
          newPeerConnection.addTrack(track, newStream);
        });
        setStream(newStream);
        setPeerConnection(newPeerConnection);
      } catch (e) {
        console.log(e);
      }
    };
    init();

    return () => {
      if (peerConnection) peerConnection.close();
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!stream) return;
    setStream((stream) => {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !isMuted;
      const newStream = new MediaStream();
      newStream.addTrack(audioTrack);
      return newStream;
    });
  }, [isMuted]);

  useEffect(() => {
    if (!peerConnection || !socket) return;
    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        useSocket('webrtc:icecandidate', event.candidate, userId);
      }
    };

    peerConnection.onopen = () => {
      setConnection('Connection Established');
    };

    socket.on('webrtc:answer', async (answer, id) => {
      if (userId !== id) {
        console.log('Received answer:', answer);
        console.log('peerConnection:', peerConnection);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('webrtc:offer', async (offer, id) => {
      if (userId !== id) {
        console.log('Received offer:', offer);
        console.log('peerConnection:', peerConnection);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
        useSocket('webrtc:answer', answer, userId);
      }
    });

    socket.on('webrtc:icecandidate', (candidate, id) => {
      if (userId !== id && peerConnection && peerConnection.remoteDescription) {
        console.log('Received ICE candidate:', candidate);
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off('webrtc:icecandidate');
      socket.off('webrtc:answer');
      socket.off('webrtc:offer');
    };
  }, [peerConnection, userId, socket]);

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <>
      <audio
        ref={remoteAudioRef}
        muted={isDeafened}
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
        <button style={{ width: '100px', height: '100px' }}>ID: {userId}</button>
        <button
          style={{ width: '100px', height: '100px' }}
          onClick={() => dispatch(toggleMute())}>
          ToggleMute {isMuted.toString()} ?
        </button>
        <button
          style={{ width: '100px', height: '100px' }}
          onClick={() => dispatch(toggleDeafen())}>
          ToggleDeafen {isDeafened.toString()} ?
        </button>
        <div style={{ color: 'white' }}>{connection}</div>
      </div>
    </>
  );
};

export default Voice;
