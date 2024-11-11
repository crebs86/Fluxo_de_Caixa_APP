<template>
  <ion-page>
    <Layout>
      <template #main>
        <ion-header>
          <ion-toolbar color="yellow-light">
            <ion-title>DEV</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">Início</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">
            <ion-text>Olá, {{ auth?.user?.data?.name ?? 'Usuário' }}!</ion-text><br>
            <ion-text>Dev URL: {{ dev_url }}</ion-text><br>
            <ion-text>Prod URL: {{ prod_url }}</ion-text>
            <hr>
            <ion-button @click="load('auth')">Testar rota protegida</ion-button>
            <ion-button @click="load('guest')">Testar rota guest</ion-button>
            <ion-button @click="loadURL()">Load URL</ion-button>
            <ion-button @click="data = {}">Limpar</ion-button>
            <hr>
            {{ data }}
          </div>

        </ion-content>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButton } from '@ionic/vue';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/Layout.vue';
import { ref } from 'vue';
import api from '../api';


const auth = useAuthStore();
const data = ref({})
const dev_url = import.meta.env.VITE_API_URL
const prod_url = import.meta.env.VITE_API_URL_PROD

function loadURL() {
  data.value = new URL(location.href)
}

function load(type) {
  api.get(type === 'auth' ? '/user' : '/test')
    .then((r) => {
      data.value = r
    })
    .catch((e) => {
      data.value = e
    })
}

</script>
