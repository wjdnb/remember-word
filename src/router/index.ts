import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "homepage",
    component: () => import("../pages/homepage.vue"),
  },
  {
    path: "/login-or-register",
    name: "register",
    component: () => import("../pages/login-or-register.vue"),
  },
  {
    path: "/console",
    name: "console",
    component: () => import("../pages/console.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
