<template>
  <v-app>
    <div class="dashboard-container">
      <CRSidebar />

      <div class="room-container">
        <h1 class="heading">Control Room Dashboard</h1>

        <div v-if="rooms.length > 0" class="room-grid">
          <router-link
            v-for="(room, index) in rooms"
            :key="index"
            :to="{ name: 'RooM', params: { roomId: room.roomId } }"
            class="room-container-wrapper"
            @click="fetchRoomDataAndJoin(room.roomName)"
          >
            <div class="room-card">
              <div class="room-info">
                <p><strong>Room ID:</strong> {{ room.roomId }}</p>
                <p><strong>Room Name:</strong> {{ room.roomName }}</p>
              </div>
            </div>
          </router-link>
        </div>
        <div v-else>
          <p class="no-data">No rooms found</p>
        </div>
      </div>
    </div>
  </v-app>
</template>


<script>
import { getDatabase, ref as dbRef, get, query, orderByChild, equalTo, set } from "firebase/database";
import CRSidebar from "@/components/CRSideBar.vue";

export default {
  components: {
    CRSidebar,
  },
  data() {
    return {
      rooms: [],
    };
  },
  created() {
    this.fetchRoomsData();
  },
  methods: {
    async fetchRoomsData() {
      try {
        const database = getDatabase();
        const roomsRef = dbRef(database, "rooms");
        const snapshot = await get(roomsRef);

        if (snapshot.exists()) {
          const roomsArray = [];
          snapshot.forEach((childSnapshot) => {
            roomsArray.push(childSnapshot.val());
          });
          this.rooms = roomsArray;
          console.log("Rooms data fetched:", this.rooms);

        } else {
          this.rooms = [];
          console.error("No rooms found");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    },
    async joinRoom(roomName) {
      try {
        console.log("Joining room:", roomName);

        const database = getDatabase();
        const roomsRef = dbRef(database, "rooms");
        const roomQuery = query(roomsRef, orderByChild('roomName'), equalTo(roomName));
        const snapshot = await get(roomQuery);

        if (snapshot.exists()) {
          snapshot.forEach(async (childSnapshot) => {
            const roomId = childSnapshot.key;
            const roomData = childSnapshot.val();
            if (!roomData.occupied) {
              const roomRef = dbRef(database, `rooms/${roomId}/occupied`);
              await set(roomRef, true);
              console.log(`Room '${roomName}' (${roomId}) occupancy status updated to true`);
            } else {
              console.log(`Room '${roomName}' (${roomId}) is already occupied`);
            }
          });
        } else {
          console.error("Room not found:", roomName);
        }
        
        this.$router.push({ name: 'RooM', params: { roomName } });

      } catch (error) {
        console.error("Error updating room status:", error);
      }
    },
    async fetchRoomDataAndJoin(roomName) {
      try {
        const database = getDatabase();
        const roomsRef = dbRef(database, "rooms");
        const roomQuery = query(roomsRef, orderByChild('roomName'), equalTo(roomName));
        const snapshot = await get(roomQuery);

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const roomId = childSnapshot.key;
            const roomData = childSnapshot.val();
            if (!roomData.occupied) {
              this.joinRoom(roomName);
            } else {
              console.log(`Room '${roomName}' (${roomId}) is already occupied`);
              // Handle logic for occupied room
            }
          });
        } else {
          console.error("Room not found:", roomName);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    },
  },
};
</script>








<style scoped>
.dashboard-container {
  display: flex;
}

.room-container {
  flex-grow: 1;
  padding: 20px;
}

.room-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.room-container-wrapper {
  flex: 0 0 calc(33.3333% - 20px);
}

.room-card {
  border: 1px solid darkblue;
  border-radius: 30px;
  padding: 10px;
}

.room-info {
  text-align: center;
  font-weight: bold;
}

.no-data {
  text-align: center;
  color: darkred;
}

.heading {
  text-align: center;
  color: navy;
}
</style>
