<template>
  <div class="room">
    <div class="room-detail">
      <button class="leave-room-btn" @click="leaveRoom">Leave the Room</button>
      <div>
        <button class="camera-btn" @click="toggleCamera">Toggle Camera</button>
        <button class="mute-btn" @click="toggleMute">Toggle Mute</button>
      </div>
      <video id="localVideo" ref="localVideo" autoplay muted></video>
      <video id="remoteVideo" ref="remoteVideo" autoplay></video>
    </div>
  </div>
</template>

<script>
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  get,
  equalTo,
  update
} from 'firebase/database';

export default {
  name: "RoomComponent",
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      configuration: {
        iceServers: [
          {
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ],
          },
        ],
        iceCandidatePoolSize: 10,
      },
      peerConnection: null,
      localStream: null,
      remoteStream: null,
      cameraOn: true,
      audioMuted: false,
      socket: null, // WebSocket connection
    };
  },
  methods: {
    async leaveRoom() {
      try {
        // Close the peer connection and stop local streams
        if (this.peerConnection) {
          this.peerConnection.close();
        }
        if (this.localStream) {
          this.localStream.getTracks().forEach(track => track.stop());
        }

        // Update the room status in the database
        const database = getDatabase();
        const roomsRef = ref(database, 'rooms');
        const roomQuery = query(roomsRef, orderByChild('roomId'), equalTo(this.roomId));
        const snapshot = await get(roomQuery);
  
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const roomRef = ref(database, `rooms/${childSnapshot.key}`);
            update(roomRef, { occupied: false });
          });
        } else {
          console.error("Room not found with ID:", this.roomId);
        }

        this.$router.back(); // Navigate back
      } catch (error) {
        console.error("Error while leaving the room:", error);
      }
    },

    async initializeWebRTC() {
      try {
        // Get user media
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.$refs.localVideo.srcObject = this.localStream;
        this.remoteStream = new MediaStream();

        // Create peer connection
        this.peerConnection = new RTCPeerConnection(this.configuration);
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });

        // Set up WebSocket connection for signaling server
        this.socket = new WebSocket('ws:localhost:8080/');
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
        };
        //this.socket.onmessage = (event) => {
          //const message = JSON.parse(event.data);
          // Handle signaling messages (offer, answer, candidate) here
          // For example: 
          // if (message.type === 'offer') { ... }
        //};
        // Handle error and close events for the WebSocket connection

        // ... Rest of your WebRTC initialization code

      } catch (error) {
        console.error("Error initializing WebRTC:", error);
      }
    },

    toggleCamera() {
      // Toggle camera on/off
      if (this.localStream && typeof this.localStream.getVideoTracks === 'function') {
        const videoTracks = this.localStream.getVideoTracks();
        if (videoTracks.length > 0) {
          this.cameraOn = !this.cameraOn;
          videoTracks[0].enabled = this.cameraOn;
        } else {
          console.error('No video tracks found in the local stream.');
        }
      } else {
        console.error('Local stream or getVideoTracks function is not available.');
      }
    },

    toggleMute() {
      // Toggle audio mute/unmute
      if (this.localStream) {
        this.audioMuted = !this.audioMuted;
        this.localStream.getAudioTracks()[0].enabled = !this.audioMuted;
      }
    },
  },
  mounted() {
    this.initializeWebRTC(); // Initialize WebRTC on component mount
  },
};
</script>



<style>
  .room {
    position: relative;
  }
  
  .room-detail {
    padding: 280px;
    border: 1px solid #ccc;
    border-radius: 50px;
  }
  
  .leave-room-btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    color:white;
    background-color: red;
    padding: 10px;
    border-radius: 30px;
    
  }
  </style>
  
  