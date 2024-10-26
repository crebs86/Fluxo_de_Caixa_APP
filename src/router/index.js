import { createRouter, createWebHistory } from "@ionic/vue-router";
import TabsPage from "../views/TabsPage.vue";
import { useAuthStore } from "../store/useAuthStore";

function checkIfLogged() {
  const store = useAuthStore();
  if (!store.getUser) return "/tabs/login";
}

function checkIfNotLogged() {
  const auth = useAuthStore();
  if (auth.getUser) return "/";
}

const routes = [
  {
    path: "/",
    redirect: "/tabs/home",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/home",
      },
      {
        path: "home",
        component: () => import("@/views/Home.vue"),
        beforeEnter: [checkIfLogged],
      },
      {
        path: "flow",
        component: () => import("@/views/Flow.vue"),
        beforeEnter: [checkIfLogged],
      },
      {
        path: "login",
        component: () => import("@/views/Login.vue"),
        beforeEnter: [checkIfNotLogged],
      },
      {
        path: "account",
        component: () => import("@/views/Account.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
