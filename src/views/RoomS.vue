<template>
  <div class="room-container">
    <h1>Rooms</h1>

    <div v-if="rooms.length > 0" class="room-grid">
      <div v-for="(room, index) in rooms" :key="index" class="room-card">
        <div class="room-info">
          <p><strong>Room ID:</strong> {{ room.roomId }}</p>
          <p><strong>Room Name:</strong> {{ room.roomName }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-data">No rooms found</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getDatabase, ref as dbRef, get } from "firebase/database";

export default {
  name: "RoomS",
  setup() {
    const rooms = ref([]);

    const fetchAllRooms = async () => {
      const database = getDatabase();
      const roomsRef = dbRef(database, "rooms");
      try {
        const snapshot = await get(roomsRef);
        if (snapshot.exists()) {
          const roomsArray = [];
          snapshot.forEach((childSnapshot) => {
            roomsArray.push(childSnapshot.val());
          });
          rooms.value = roomsArray;
        } else {
          rooms.value = [];
          console.error("No rooms found");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchAllRooms();

    return {
      rooms,
    };
  },
};
</script>

<style scoped>
.room-container {
  padding: 20px;
}

.room-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 60px;
}

.room-card {
  flex: 0 0 calc(20% - 10px); /* Three cards in a row */
  border: 1px solid darkblue;
  border-radius: 20px;
  padding: 10px;
}

.room-info {
  text-align: center;
  font-weight: bold;
}
</style>
