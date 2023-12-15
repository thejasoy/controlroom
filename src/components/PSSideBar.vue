<template>
  <div class="sidebar">
    <router-link to="/PSDashBoard">Dashboard</router-link><br />

    <router-link to="/">Log Out</router-link>
  </div>
</template>

<script>
export default {
  name: "PSSideBar",
};
</script>

<style scoped>
.sidebar {
  height: 100vh;
  width: 200px;
  background-color: #2c3e50;
  padding: 20px;
  color: #ecf0f1;
  border-right: 1px solid #34495e;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar a {
  display: block;
  margin-bottom: 10px;
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s;
}

.sidebar a:hover {
  text-decoration: underline;
  color: #3498db;
}
</style>
