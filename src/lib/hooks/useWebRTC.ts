import { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot, addDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
};

export function useWebRTC(roomId: string, userId: string, isHost: boolean) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        const startCall = async () => {
            try {
                pc.current = new RTCPeerConnection(servers);

                // More explicit constraints to improve camera compatibility and quality
                const constraints: MediaStreamConstraints = {
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                    audio: { echoCancellation: true, noiseSuppression: true }
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                setLocalStream(stream);
                stream.getTracks().forEach((track) => {
                    pc.current?.addTrack(track, stream);
                });
            } catch (err: any) {
                console.error("Error accessing media devices:", err);
                // Provide a more actionable error to the UI
                const message = err?.name === 'NotAllowedError' ?
                    'Camera/microphone access was denied. Please enable permissions for this site.' :
                    'Could not access camera/microphone. Please check device connectivity and permissions.';
                setError(message);
                return;
            }

            pc.current.ontrack = (event) => {
                event.streams[0] && setRemoteStream(event.streams[0]);
            };

            const callDoc = doc(db, 'calls', roomId);
            const offerCandidates = collection(callDoc, 'offerCandidates');
            const answerCandidates = collection(callDoc, 'answerCandidates');

            if (isHost) {
                pc.current.onicecandidate = (event) => {
                    event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
                };

                const offerDescription = await pc.current.createOffer();
                await pc.current.setLocalDescription(offerDescription);

                const offer = {
                    sdp: offerDescription.sdp,
                    type: offerDescription.type,
                };

                await setDoc(callDoc, { offer });

                onSnapshot(callDoc, (snapshot) => {
                    const data = snapshot.data();
                    const pcRef = pc.current;
                    if (!pcRef) return;
                    if (!pcRef.currentRemoteDescription && data?.answer) {
                        const answerDescription = new RTCSessionDescription(data.answer);
                        pcRef.setRemoteDescription(answerDescription);
                    }
                });

                onSnapshot(answerCandidates, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const candidate = new RTCIceCandidate(change.doc.data());
                            pc.current?.addIceCandidate(candidate);
                        }
                    });
                });
            } else {
                pc.current.onicecandidate = (event) => {
                    event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
                };

                // If a host already created an offer, answer immediately. Otherwise
                // listen for the call document and answer when the offer appears.
                let answered = false;

                const tryAnswer = async (offerData: any) => {
                    if (answered) return;
                    const pcRef = pc.current;
                    if (!pcRef) {
                        setError('Peer connection not initialized');
                        return;
                    }
                    try {
                        await pcRef.setRemoteDescription(new RTCSessionDescription(offerData));
                        const answerDescription = await pcRef.createAnswer();
                        await pcRef.setLocalDescription(answerDescription);

                        const answer = {
                            type: answerDescription.type,
                            sdp: answerDescription.sdp,
                        };

                        await updateDoc(callDoc, { answer });
                        answered = true;
                    } catch (e: any) {
                        console.error('Error answering call offer', e);
                    }
                };

                // Check existing doc once first
                try {
                    const callSnapshot = await getDoc(callDoc);
                    const callData = callSnapshot.data();
                    if (callData?.offer) {
                        await tryAnswer(callData.offer);
                    }
                } catch (e) {
                    // ignore getDoc errors and rely on snapshot listener
                }

                // Listen for offer appearing later
                onSnapshot(callDoc, (snapshot) => {
                    const data = snapshot.data();
                    if (data?.offer && !answered) {
                        tryAnswer(data.offer);
                    }
                });

                onSnapshot(offerCandidates, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const candidate = new RTCIceCandidate(change.doc.data());
                            pc.current?.addIceCandidate(candidate);
                        }
                    });
                });
            }
        };

        startCall();

        return () => {
            pc.current?.close();
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, [roomId, isHost]);

    return { localStream, remoteStream, error };
}
