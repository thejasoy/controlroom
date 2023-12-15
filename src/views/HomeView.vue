<template>
  <div class="container">
    <h1>Welcome</h1>
    <div class="login-box">
      <h2>User Login</h2>
      <input v-model="email" type="email" placeholder="Email" class="input" />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="input"
      />
      <button @click="login" class="button">Login</button>
      <div v-if="showMessage" class="message">
        Login successful for {{ email }}
      </div>
      <div v-if="passwordMessage" class="message" :style="passwordMessageStyle">
        {{ passwordMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase.js";

export default {
  data() {
    return {
      email: "",
      password: "",
      passwordMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(getAuth(), this.email, this.password);

        const adminEmail = "admin@gmail.com";
        if (this.email === adminEmail) {
          this.passwordMessage = "Admin login successful!";
          this.$router.push("/dashboard");
          return;
        }

        const userRole = await this.getUserRole(this.email);
        console.log("Fetched user role:", userRole);
        if (userRole) {
          if (userRole === "ControlRoom") {
            console.log("Redirecting to Control Room dashboard...");
            this.$router.push("/CRDashBoard");
          } else if (userRole === "PoliceStation") {
            console.log("Redirecting to Police Station dashboard...");
            this.$router.push("/PSDashBoard");
          } else {
            this.passwordMessage = "Invalid user role.";
          }
        } else {
          this.passwordMessage = "Invalid user role or user not found.";
        }
      } catch (error) {
        console.error("Login Error:", error);
        this.passwordMessage = "Invalid credentials. Please try again.";
      }
    },
    async getUserRole(email) {
      try {
        const snapshot = await get(ref(db, "users"));

        if (snapshot.exists()) {
          const users = snapshot.val();
          let userRole = null;

          Object.values(users).forEach((user) => {
            if (user.email === email) {
              userRole = user.role;
            }
          });

          return userRole || null;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        throw error;
      }
    },
  },
};
</script>


<style scoped>
.container {
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
}

.login-box {
  background-color: whitesmoke;
  border: 2px solid white;
  border-radius: 15px;
  padding: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: black;
}

.input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  width: 50%;
  padding: 5px;
  background-color: darkblue;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.message {
  margin: 10px 0;
  color: red;
}

.error {
  margin: 10px 0;
  color: red;
}
</style>
