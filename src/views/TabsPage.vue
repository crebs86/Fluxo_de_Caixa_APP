<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" color="yellow-light">

        <ion-tab-button tab="tab1" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Início</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/flow">
          <ion-icon aria-hidden="true" :icon="barChart" />
          <ion-label>Fluxo</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/login" v-if="!auth?.user">
          <ion-icon aria-hidden="true" :src="sign_in" />
          <ion-label>Login</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="tab3" href="/tabs/account" v-else>
          <ion-icon aria-hidden="true" :icon="personSharp" />
          <ion-label>Conta</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="tab4" href="/tabs/dev" v-if="env === 'dev'">
          <ion-icon aria-hidden="true" :icon="settings" />
          <ion-label>DEV</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { barChart, home, personSharp, settings } from 'ionicons/icons';
import sign_in from '../assets/icons/sign-in-alt.svg'
import { useAuthStore } from '../store/useAuthStore';

const auth = useAuthStore();

const env = import.meta.env.VITE_ENV;
</script>
