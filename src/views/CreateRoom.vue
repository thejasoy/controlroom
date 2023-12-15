<template>
  <div class="add-room-container">
    <h2>Add Room</h2>
    <form @submit.prevent="addRoom" class="add-room-form">
      <label for="roomId">Room ID:</label>
      <input
        type="text"
        v-model="newRoom.roomId"
        id="roomId"
        class="input-field"
        required
      />

      <label for="roomName">Room Name:</label>
      <input
        type="text"
        v-model="newRoom.roomName"
        id="roomName"
        class="input-field"
        required
      />

      <button type="submit" class="submit-btn">Add Room</button>
    </form>
  </div>
</template>

<script>
import { ref, push, set } from "firebase/database";
import { db } from "./firebase.js";

export default {
  data() {
    return {
      newRoom: {
        roomId: "",
        roomName: "",
      },
    };
  },
  methods: {
    async addRoom() {
      try {
        const roomsRef = ref(db, "rooms");

        const newRoomRef = push(roomsRef);
        console.log("New Room Reference:", newRoomRef.toString());

        const roomDetails = {
          roomId: this.newRoom.roomId,
          roomName: this.newRoom.roomName,
          occupied: false,
        };

        await set(newRoomRef, roomDetails);

        console.log("Room added to Firebase with ID:", newRoomRef.key);
        window.alert("Room added successfully");
        this.$router.push("/Dashboard");
      } catch (error) {
        console.error("Error adding room to database:", error.message);
        window.alert("Failed to add room to database. Error: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.add-room-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
}

.add-room-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: black;
}

.add-room-form label {
  display: block;
  margin-bottom: 8px;
  color: black;
}

.add-room-form .input-field {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid black;
  border-radius: 4px;
  outline: none;
}

.add-room-form .submit-btn {
  width: 30%;
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
}

.add-room-form .submit-btn:hover {
  background-color: darkgreen;
}
</style>
