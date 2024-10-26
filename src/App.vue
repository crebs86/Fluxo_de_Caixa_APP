<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { useAuthStore } from './store/useAuthStore';

const store = useAuthStore();

onMounted(() => {
  store.setUser();
})
</script>
