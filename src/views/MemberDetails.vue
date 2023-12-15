<template>
  <div>
    <h1>Member Details</h1>

    <div class="button-container">
      <button @click="showAllUsers">Show All Users</button>
      <button @click="showControlRoomUsers">Show Control Room Users</button>
      <button @click="showPoliceStationUsers">Show Police Station Users</button>
    </div>

    <div v-if="showSearchBar" class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search users..." />
      <button @click="filterUsers">Search</button>
    </div>

    <div v-if="filteredUsers.length > 0" class="container">
      <div
        v-for="(user, index) in filteredUsers"
        :key="index"
        class="user-details"
      >
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Password:</strong>{{ user.password }}</p>
        <p><strong>Location:</strong> {{ user.location }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
        <div class="hr-separator"></div>
      </div>
    </div>
    <div v-else>
      <p class="no-data">No users found</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getDatabase, ref as dbRef, get } from "firebase/database";

export default {
  setup() {
    const users = ref([]);
    const filteredUsers = ref([]);
    const searchQuery = ref("");
    const showSearchBar = ref(false);

    const fetchAllUsers = async () => {
      const database = getDatabase();
      const usersRef = dbRef(database, "users");
      try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersArray = [];
          snapshot.forEach((childSnapshot) => {
            usersArray.push(childSnapshot.val());
          });
          users.value = usersArray;
          filteredUsers.value = usersArray;
          showSearchBar.value = true;
        } else {
          users.value = [];
          filteredUsers.value = [];
          console.error("No users found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const showAllUsers = () => {
      fetchAllUsers();
    };

    const showControlRoomUsers = () => {
      filteredUsers.value = users.value.filter(
        (user) => user.role === "ControlRoom"
      );
      showSearchBar.value = true;
    };

    const showPoliceStationUsers = () => {
      filteredUsers.value = users.value.filter(
        (user) => user.role === "PoliceStation"
      );
      showSearchBar.value = true;
    };

    const filterUsers = () => {
      const query = searchQuery.value.toLowerCase();
      let matchedUsers = users.value.filter((user) =>
        matchesSearchQuery(user, query)
      );

      if (showSearchBar.value) {
        if (filteredUsers.value.some((user) => user.role === "ControlRoom")) {
          matchedUsers = matchedUsers.filter(
            (user) => user.role === "ControlRoom"
          );
        } else if (
          filteredUsers.value.some((user) => user.role === "PoliceStation")
        ) {
          matchedUsers = matchedUsers.filter(
            (user) => user.role === "PoliceStation"
          );
        }
        filteredUsers.value = matchedUsers;
      }
    };

    const matchesSearchQuery = (user, query) => {
      return (
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.location.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    };

    return {
      users,
      filteredUsers,
      searchQuery,
      showSearchBar,
      showAllUsers,
      showControlRoomUsers,
      showPoliceStationUsers,
      filterUsers,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #05759e;
  color: white;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #02525c;
}

button:focus {
  outline: none;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

input[type="text"] {
  padding: 8px;
  margin-right: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 60%;
  font-size: 1em;
}

button.filter {
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #008cba;
  color: white;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

button.filter:hover {
  background-color: #005f6b;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.user-details {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: whitesmoke;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 300px;
}

.user-details p {
  margin: 8px 0;
}

.user-details strong {
  font-weight: bold;
}

.hr-separator {
  width: 100%;
  border-bottom: 1px solid #ccc;
  margin: 20px 0;
}

.no-data {
  text-align: center;
}

@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }

  .user-details {
    width: 90%;
  }

  input[type="text"] {
    width: 80%;
  }
}
</style>
