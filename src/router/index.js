import { createRouter, createWebHistory } from "@ionic/vue-router";
import TabsPage from "../views/TabsPage.vue";
import { useAuthStore } from "../store/useAuthStore";

function checkIfLogged() {
  const store = useAuthStore();
  //console.log('checkIfLogged',store.getUser)
  if (!store.getUser) return "/tabs/login";
}

function checkIfNotLogged() {
  const store = useAuthStore();
  if (store.getUser) return "/";
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
        name: "home",
      },
      {
        path: "flow",
        component: () => import("@/views/Flow.vue"),
        beforeEnter: [checkIfLogged],
        name: "flow",
      },
      {
        path: "login",
        component: () => import("@/views/Login.vue"),
        beforeEnter: [checkIfNotLogged],
        name: "login",
      },
      {
        path: "account",
        component: () => import("@/views/Account.vue"),
        name: "account",
      },
      {
        path: "dev",
        component: () => import("@/views/Dev.vue"),
        name: "dev",
      },

      {
        path: "stores",
        component: () => import("@/views/Stores.vue"),
        beforeEnter: [checkIfLogged],
        name: "stores",
      },
      {
        path: "stores/new",
        component: () => import("@/views/StoresNew.vue"),
        beforeEnter: [checkIfLogged],
        name: "stores-new",
      },
      {
        path: "stores/edit/:id",
        component: () => import("@/views/StoresEdit.vue"),
        beforeEnter: [checkIfLogged],
        name: "stores-edit",
      },

      {
        path: "suppliers",
        component: () => import("@/views/Suppliers.vue"),
        beforeEnter: [checkIfLogged],
        name: "suppliers",
      },
      {
        path: "suppliers/new/:store",
        component: () => import("@/views/SuppliersNew.vue"),
        beforeEnter: [checkIfLogged],
        name: "supplier-new",
      },
      {
        path: "suppliers/edit/:id",
        component: () => import("@/views/StoresEdit.vue"),
        beforeEnter: [checkIfLogged],
        name: "supplier-edit",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
