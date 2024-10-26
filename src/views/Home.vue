<template>
  <ion-page>
    <Layout>
      <template #main>
        <ion-header>
          <ion-toolbar color="yellow-light">
            <ion-title>Início</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">Início</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">
            <ion-text>Olá, {{ auth?.user?.data?.name }}!</ion-text>
          </div>

        </ion-content>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText } from '@ionic/vue';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/Layout.vue';

const auth = useAuthStore();
</script>
