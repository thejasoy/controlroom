import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import Dashboard from "../views/DashBoard.vue";
import AddUser from "../views/AddUser.vue";
import SideBar from "../components/SideBar.vue";
import MemberDetails from "../views/MemberDetails.vue";
import CRDashBoard from "../views/CRDashBoard.vue";
import PSDashBoard from "../views/PSDashBoard.vue";
import PSSideBar from "../components/PSSideBar.vue";
import CRSideBar from "../components/CRSideBar.vue";
import CreateRoom from "../views/CreateRoom.vue";
import RoomS from "../views/RoomS.vue";
import rooM from "../components/RooM.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/AddUser",
    name: "AddUser",
    component: AddUser,
  },
  {
    path: "/SideBar",
    name: "SideBar",
    component: SideBar,
  },
  {
    path: "/MemberDetails",
    name: "MemberDetails",
    component: MemberDetails,
  },
  {
    path: "/CRDashBoard",
    name: "CRDashBoard",
    component: CRDashBoard,
  },
  {
    path: "/PSDashBoard",
    name: "PSDashBoard",
    component: PSDashBoard,
  },
  {
    path: "/PSSideBar",
    name: "PSSideBar",
    component: PSSideBar,
  },
  {
    path: "/CRSideBar",
    name: "CRSideBar",
    component: CRSideBar,
  },
  {
    path: "/CreateRoom",
    name: "CreateRoom",
    component: CreateRoom,
  },
  {
    path: "/RoomS",
    name: "RoomS",
    component: RoomS,
  },
  {
    path: "/room/:roomId",
    name: "RooM",
    component: rooM,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
