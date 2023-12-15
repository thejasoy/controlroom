User
<template>
  <v-app>
    <div class="header">
      <Sidebar />
      <div class="title-container">
        <h1 class="dashboard-title">Admin Dashboard</h1>
      </div>
    </div>

    <v-divider></v-divider>
    <div></div>
  </v-app>
</template>

<script>
import Sidebar from "@/components/SideBar.vue";

export default {
  components: {
    Sidebar,
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: whitesmoke;
  color: #ecf0f1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.title-container {
  flex-grow: 1;
}

.dashboard-title {
  font-size: 2.5em;
  margin: 0;
  color: #3498db;
  text-align: center;
}
</style>
