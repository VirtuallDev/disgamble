import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleIsTalking } from '../../redux/sounds';
import { AuthContext } from '../../App';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

const PeerConnection = forwardRef((props, ref) => {
  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened, pushToTalk } = userSounds;
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerUserId = useRef(null);
  const icesRef = useRef([]);
  const { useApi, useSocket, socket } = useContext(AuthContext);
  const dispatch = useDispatch();

  const init = async () => {
    try {
      if (peerConnection.current) peerConnection.current.close();
      if (stream)
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      peerUserId.current = null;
      setStream(null);
      setRemoteStream(null);
      const newpeerConnection = new RTCPeerConnection(configuration);
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!newStream) return;
      newStream.getAudioTracks().forEach((track) => {
        if (pushToTalk && !isMuted) track.enabled = true;
        if (!pushToTalk || isMuted) track.enabled = false;
        newpeerConnection.addTrack(track, newStream);
      });
      setStream(newStream);
      peerConnection.current = newpeerConnection;
    } catch (e) {
      console.log(e);
    }
  };

  useImperativeHandle(ref, () => ({
    sendOffer: async (userId) => {
      if (peerConnection.current && !peerConnection.current.localDescription) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));
        useSocket('webrtc:offer', offer, userId);
      }
    },
    acceptOffer: async (callId) => {
      if (peerConnection.current) {
        useSocket('user:answer', callId);
      }
    },
  }));

  useEffect(() => {
    init();
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
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
      if (pushToTalk && !isMuted) audioTrack.enabled = true;
      if (!pushToTalk || isMuted) audioTrack.enabled = false;
      const newStream = new MediaStream();
      newStream.addTrack(audioTrack);
      return newStream;
    });
  }, [isMuted, pushToTalk]);

  useEffect(() => {
    if (!peerConnection.current) return;
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        icesRef.current = [...icesRef.current, event.candidate];
      }
    };

    socket.on('webrtc:answer', async (answer, userId) => {
      peerUserId.current = userId;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('webrtc:offer', async (offer, userId) => {
      peerUserId.current = userId;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));
      useSocket('webrtc:answer', answer, userId);
    });

    socket.on('webrtc:icecandidate', (ices) => {
      if (peerConnection.current && peerConnection.current.remoteDescription) {
        ices.forEach((ice) => {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(ice));
        });
      }
    });

    socket.on('webrtc:disconnect', () => {
      init();
    });

    socket.on('webrtc:exchange', () => {
      useSocket('webrtc:icecandidate', icesRef.current, peerUserId.current);
    });

    return () => {
      socket.off('webrtc:answer');
      socket.off('webrtc:offer');
      socket.off('webrtc:icecandidate');
      socket.off('webrtc:disconnect');
      socket.off('webrtc:exchange');
    };
  }, [peerConnection.current, socket]);

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) remoteAudioRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    if (!remoteStream) return;
    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(remoteStream);
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
    setInterval(() => {
      const audioVolume = getAudioVolume();
      dispatch(toggleIsTalking(audioVolume > 0 ? true : false));
    }, 16);
  }, [remoteStream]);

  return (
    <audio
      ref={remoteAudioRef}
      muted={isDeafened}
      autoPlay
    />
  );
});

export default PeerConnection;
