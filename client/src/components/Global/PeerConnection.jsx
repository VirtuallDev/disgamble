import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import useAuth from '../../customhooks/useAuth';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

const PeerConnection = forwardRef((props, ref) => {
  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened } = userSounds;
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { useApi, useSocket, socket } = useAuth();

  useImperativeHandle(ref, () => ({
    sendOffer: async (userId) => {
      if (peerConnection.current && !peerConnection.current.localDescription) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));
        useSocket('webrtc:offer', offer, userId);
      }
    },
    acceptOffer: async (callId) => {
      if (peerConnection.current && !peerConnection.current.localDescription) {
        useSocket('user:answer', callId);
      }
    },
    disconnect: () => {
      peerConnection.current = null;
    },
  }));

  useEffect(() => {
    const init = async () => {
      try {
        const newpeerConnection = new RTCPeerConnection(configuration);
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        newStream.getAudioTracks().forEach((track) => {
          newpeerConnection.addTrack(track, newStream);
        });
        setStream(newStream);
        peerConnection.current = newpeerConnection;
      } catch (e) {
        console.log(e);
      }
    };
    init();

    return () => {
      if (peerConnection.current) peerConnection.current.close();
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
    if (!peerConnection.current) return;
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        useSocket('webrtc:icecandidate', event.candidate);
      }
    };

    socket.on('webrtc:answer', async (answer) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('webrtc:offer', async (offer, userId) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));
      useSocket('webrtc:answer', answer, userId);
    });

    socket.on('webrtc:icecandidate', (candidate) => {
      if (peerConnection.current && peerConnection.current.remoteDescription) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off('webrtc:icecandidate');
      socket.off('webrtc:answer');
      socket.off('webrtc:offer');
    };
  }, [peerConnection.current]);

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, socket]);

  return (
    <audio
      ref={remoteAudioRef}
      muted={isDeafened}
      autoPlay
    />
  );
});

export default PeerConnection;
