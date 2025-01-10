import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import MembersView from "@/views/MembersView.vue";
import TrainersView from "@/views/TrainersView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/home",
      meta: { requiresAuth: true },
      component: HomeView,
    },
    {
      path: "/members",
      meta: { requiresAuth: true },
      component: MembersView,
    },
    {
      path: "/trainers",
      meta: { requiresAuth: true },
      component: TrainersView,
    },
  ],
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (to.meta.requiresAuth && !token) {
        next("/");
    } else {
        next();
    }
});

export default router;
