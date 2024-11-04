<template>
  <ion-page>
    <Layout>
      <template #main>
        <ion-header>
          <ion-toolbar>
            <ion-title>Conta</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
          <ion-header collapse="condense">
            <ion-toolbar>
              <ion-title size="large">Conta</ion-title>
            </ion-toolbar>
          </ion-header>
          <div class="container">
            <ion-list>
              <ion-item>
                <ion-label>Nome: {{ auth.user?.data?.name }}</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>E-mail: {{ auth.user?.data?.email }}</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Tipo de conta: Padrão</ion-label>
              </ion-item>
              <ion-item>
                <ion-button size="small" color="danger" @click="userLogout()">
                  <ion-icon :icon="logOut"></ion-icon>
                  Sair
                </ion-button>
              </ion-item>
            </ion-list>
          </div>
        </ion-content>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton } from '@ionic/vue';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/Layout.vue';
import { logOut } from 'ionicons/icons';
import router from '../router';
import api from '../api';

const auth = useAuthStore();

const userLogout = async () => {
  try {
    await api.get('/logout', auth.getHeaderConfig);
    auth.clearStoredData();
    router.push('/tabs/login')
  } catch (e) {
    console.log(e)
  }
}
</script>
