<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header title="Lojas" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">Lojas</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">

            <ion-text>Minhas Lojas({{ stores?.length }})</ion-text>
            <ion-list class="list">
              <ion-item v-for="(s, i) in stores" :key="'store' + i" color="ice"
                @click="goTo('/tabs/stores/edit/' + s.id)">
                {{ s.name }}
              </ion-item>
            </ion-list>
            <hr>

            <!-- <ion-text>Lojas Adicionadas</ion-text> -->

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
              <ion-fab-button color="amber">
                <ion-icon :icon="add"></ion-icon>
              </ion-fab-button>
              <ion-fab-list side="top">
                <ion-fab-button @click="newStore()">
                  <ion-col>
                    <ion-row style="display: block">
                      <ion-icon :src="shop"></ion-icon>
                    </ion-row>
                    <ion-row class="ion-text-capitalize">
                      <small>Loja</small>
                    </ion-row>
                  </ion-col>
                </ion-fab-button>
              </ion-fab-list>
            </ion-fab>
          </div>

          <ion-toast :is-open="isOpen" :message="message" :duration="4000" position="middle" color="danger"
            @didDismiss="setOpen(false)">
          </ion-toast>

        </ion-content>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonCol, IonRow, IonList, IonItem, IonText, IonToast } from '@ionic/vue';
import Layout from '../components/Layout.vue';
import Header from '../components/Header.vue';
import { onMounted, ref } from 'vue';
import api from '../api';
import { goTo } from '../modules/utils';

import shop from '../assets/icons/shop.svg';
import { add } from 'ionicons/icons';

const stores = ref(null)
const isOpen = ref(false)
const setOpen = (status) => {
  isOpen.value = status
}
const message = ref('')

// function getStore(ev) {
//   api.get('/api/getStore/' + ev.detail.value)
//     .then(r => {
//       stores.value = r.data
//     })
//     .catch()
// }

function newStore() {
  if (stores.value.length >= 1) {
    setOpen(true)
    message.value = 'Você atingiu o número máximo de lojas para conta gratuita.';
  } else {
    goTo('/tabs/stores/new')
  }
}

onMounted(() => {
  api.get('/stores')
    .then(r => {
      stores.value = r.data
    })
    .catch((e) => {
      if (e.response.status === 401) {
        message.value = e.response.data.message
        setOpen(true)
      }
    })
})

</script>

<style scoped>
ion-fab {
  margin-bottom: 52px;
}

.list {
  background-color: var(--ion-color-ice-tint);
  border-width: 0;
}
</style>