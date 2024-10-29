<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header title="Fornecedores" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">Fornecedores</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">


            <ion-item color="ice">
              <ion-select label="Loja:" label-placement="fixed" placeholder="selecionar"
                @ionChange="loadSupplies($event)">
                <ion-select-option :value="s.id" color="ice" v-for="(s, i) in stores" :key="'store' + i">
                  {{ s.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <div class="mt-4 ml-4">Fornecedores da Loja({{ supplies.length ?? 0 }})</div>

            <hr>

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

          <ion-toast :is-open="isOpen" :message="message" :duration="4000" position="middle" :color="color"
            @didDismiss="setOpen(false)">
          </ion-toast>

        </ion-content>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonCol, IonRow, IonList, IonItem, IonText, IonToast, IonSelect, IonSelectOption } from '@ionic/vue';
import Layout from '../components/Layout.vue';
import Header from '../components/Header.vue';
import { onMounted, ref } from 'vue';
import api from '../api';
import { goTo } from '../modules/utils';

import shop from '../assets/icons/shop.svg';
import { add } from 'ionicons/icons';

const stores = ref(null)
const isOpen = ref(false)
const color = ref('danger')
const setOpen = (status) => {
  isOpen.value = status
}
const message = ref('');

const supplies = ref({});

function loadSupplies(ev) {
  supplies.value = {}
  api.get('supplies/loadByStore/' + ev.detail.value)
    .then((r) => {
      if (r.data?.length < 1) {
        message.value = 'Nenhum fornecedor cadastrado para esta loja.';
        color.value = 'warning'
        setOpen(true)
      } else {
        supplies.value = r.data
      }
    })
    .catch((e) => {
      if (e?.response?.status === 419) {
        message.value = e?.response?.data
      } else {
        message.value = 'Ocorreu um erro ao processar sua solicitação.';
      }
      color.value = 'danger'
      setOpen(true)
    })
}

function newStore() {
  if (stores.value.length >= 1) {
    color.value = 'danger'
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
      color.value = 'danger'
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