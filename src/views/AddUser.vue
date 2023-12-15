<template>
  <div>
    <div class="form-box">
      <h1>Add User</h1>

      <form @submit.prevent="addUser" class="user-form">
        <label>Select the user's Role:</label>
        <div class="role-options">
          <label>
            <input
              type="radio"
              v-model="newUser.role"
              value="PoliceStation"
            />Police Station
          </label>
          <label>
            <input
              type="radio"
              v-model="newUser.role"
              value="ControlRoom"
            />Control Room
          </label>
        </div>

        <label for="username">Username:</label>
        <input type="text" id="username" v-model="newUser.username" required />

        <label for="email">Email:</label>
        <input type="email" id="email" v-model="newUser.email" required />

        <label for="password">Password:</label>
        <input type="text" id="password" v-model="newUser.password" required />

        <label for="location">Location:</label>
        <input type="text" id="location" v-model="newUser.location" required />

        <button type="submit" class="submit-button">Add User</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, push } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase.js";

export default {
  data() {
    return {
      newUser: {
        role: "",
        username: "",
        email: "",
        password: "",
        location: "",
      },
    };
  },
  methods: {
    async addUser() {
      if (!this.validateEmail(this.newUser.email)) {
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.newUser.email,
          this.newUser.password
        );

        const user = userCredential.user;

        if (user) {
          const userDetails = {
            role: this.newUser.role,
            username: this.newUser.username,
            email: this.newUser.email,
            location: this.newUser.location,
            password: this.newUser.password,
          };

          const usersRef = ref(db, "users");
          push(usersRef, userDetails)
            .then((newUserRef) => {
              console.log("User added with ID: ", newUserRef.key);
              window.alert("User added successfully");
              this.$router.push("/Dashboard");
            })
            .catch((error) => {
              console.error("Error adding user details to database:", error);
              window.alert("Failed to add user details to database");
            });
        }
      } catch (error) {
        console.error("Error creating user:", error);
        window.alert("Failed to create user");
      }
    },
    validateEmail(email) {
      const emailRegex = /.*@.*\.com$/;
      return emailRegex.test(email);
    },
  },
};
</script>

<style scoped>
.role-options {
  display: flex;
  margin-bottom: 16px;
}

.role-options label {
  margin-right: 20px;
  font-size: 1.2em;
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
  color: darkblue;
}

.user-form {
  max-width: 400px;
  margin: auto;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error-message {
  color: red;
  font-size: 0.8em;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 40px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.form-box {
  background-color: whitesmoke;
  border: 2px solid lightskyblue;
  border-radius: 100px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: black;
}
</style>
