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
                @click="goTo({ name: 'stores-edit', params: { id: s.id } })">
                {{ s.name }}
              </ion-item>
            </ion-list>
            <hr>

            <!-- <ion-text>Lojas Adicionadas</ion-text> -->

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
              <ion-fab-button color="amber">
                <ion-icon :icon="add"></ion-icon>
              </ion-fab-button>
              <ion-fab-list side="start">
                <ion-button class="button-fab" color="yellow-light" @click="newStore()">
                  <ion-col>
                    <ion-row style="display: block">
                      <ion-icon :src="shop" size="large"></ion-icon>
                    </ion-row>
                    <ion-row class="ion-text-capitalize">
                      <small>Loja</small>
                    </ion-row>
                  </ion-col>
                </ion-button>
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonFabList, IonButton, IonIcon, IonCol, IonRow, IonList, IonItem, IonText, IonToast } from '@ionic/vue';
import Layout from '../components/Layout.vue';
import Header from '../components/Header.vue';
import { onMounted, ref } from 'vue';
import api from '../api';
import { goTo } from '../modules/utils';

import shop from '../assets/icons/shop.svg';
import { add } from 'ionicons/icons';
import { utils } from '../store/utils';

const stores = ref(null)
const createStore = ref(false)
const isOpen = ref(false)
const setOpen = (status) => {
  isOpen.value = status
}
const message = ref('');
const loading = utils();

async function newStore() {
  console.log('canCreateStore', createStore.value)
  await canCreateNewStore()
  if (!createStore.value) {
    setOpen(true)
  } else {
    goTo({ name: 'stores-new' })
  }
  createStore.value = false
}

async function canCreateNewStore() {
  await api.get('/api/stores/can-create-new-store')
    .then((r) => {
      createStore.value = r.data
    })
    .catch((e) => {
      createStore.value = false
      message.value = e.response?.data?.message;
    })
    .finally(
      () => { }
    )
}

onMounted(() => {
  loading.status = true

  api.get('/api/stores')
    .then(r => {
      stores.value = r.data
    })
    .catch((e) => {
      //if (e.response.status === 401) {
      message.value = e.response?.data?.message
      setOpen(true)
      //}
    })
    .finally(() => {
      loading.status = false
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

.button-fab {
  margin-top: -14px;
}
</style>