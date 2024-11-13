<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header title="Nova Loja" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">Nova Loja</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">

            <ion-list class="list">
              <ion-item color="ice">
                <ion-input label="Nome" label-placement="floating" color="amber" v-model="storeModel.name"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="E-mail" type="email" label-placement="floating" color="amber"
                  v-model="storeModel.email"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Contato 1" type="tel" label-placement="floating" color="amber"
                  v-model="storeModel.contact1" @keyup="maskPhone($event)" maxlength="15"></ion-input>
              </ion-item>
              <ion-item color="ice">
                <ion-input label="Contato 2" type="tel" label-placement="floating" color="amber"
                  v-model="storeModel.contact2" @keyup="maskPhone($event)" maxlength="15"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Endereço" type="text" label-placement="floating" color="amber"
                  v-model="storeModel.address"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="CPF/CNPJ" type="text" label-placement="floating" color="amber"
                  v-model="storeModel.docs" @keyup="maskDocs($event)" maxlength="18"></ion-input>
              </ion-item>

            </ion-list>

            <ion-button expand="full" color="amber" @click="crateStore()">Criar Loja</ion-button>

            <ion-text v-for="(e, i) in storeModel.errors?.name" :key="'er_name' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in storeModel.errors?.email" :key="'er_email' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in storeModel.errors?.contact1" :key="'er_contact1' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in storeModel.errors?.contact2" :key="'er_contact2' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in storeModel.errors?.address" :key="'er_address' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in storeModel.errors?.docs" :key="'er_docs' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>

          </div>
          <ion-toast :is-open="isOpen" :message="storeModel.error_message" :duration="3000" position="middle"
            color="danger" @didDismiss="setOpen(false)">
          </ion-toast>
          <!-- <ion-loading color="green-light" :is-open="isOpenLoading" message="Efetuando login...">
          </ion-loading> -->
        </ion-content>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, IonToast, IonText } from '@ionic/vue';
import Layout from '../components/Layout.vue';
import Header from '../components/Header.vue';
import { phoneMask, docsMask } from '../modules/mask';
import { ref } from 'vue';
import { email, length } from '../modules/validation';
import api from '../api';
import { goTo } from '../modules/utils';
import { utils } from '../store/utils';

const loading = utils()

const storeModel = ref({
  name: '',
  email: '',
  docs: '',
  contact1: '',
  contact2: '',
  address: '',
  error_message: '',
  errors: {}
})

const isOpen = ref(false);

const setOpen = (state) => {
  isOpen.value = state;
}

const maskPhone = (event) => {
  let input = event.target
  input.value = phoneMask(input.value)
}

const maskDocs = (event) => {
  let input = event.target
  input.value = docsMask(input.value)
}

function crateStore() {
  try {
    storeModel.value.errors = {}
    storeModel.value.error_message = ''
    if (
      length({ value: storeModel.value.name, min: 3, max: 255, field: 'Nome' })
      , email(storeModel.value.email) && length({ value: storeModel.value.email, min: 5, max: 255, field: 'E-mail' })
      , (length({ value: storeModel.value.contact1, min: 13, max: 14, field: 'Contato 1' }))
      , (!storeModel.value.contact2 || length({ value: storeModel.value.contact2, min: 13, max: 14, field: 'Contato 2' }))
      , (!storeModel.value.address || length({ value: storeModel.value.address, min: 5, max: 255, field: 'Endereço' }))
      , length({ value: storeModel.value.docs ? storeModel.value.docs.match(/\d/g).join("") : '', min: 11, max: 14, field: 'CPF/CNPJ' })
    ) {
      loading.status = true
      api.post('/api/stores/store', storeModel.value)
        .then((r) => {
          goTo({ name: 'stores-edit', params: { id: r.data.id } })
        })
        .catch((e) => {
          if (e?.response?.status === 422) {
            storeModel.value.errors = e?.response?.data.errors
            storeModel.value.error_message = 'Não foi possível concluir a ação. Verifique os erros abaixo.'
          } else if (e?.response?.status === 401) {
            storeModel.value.error_message = e?.response?.data.message
          } else {
            storeModel.value.error_message = 'Ocorreu um erro ao processar solicitação.'
          }
          setOpen(true)
        })
        .finally(() => {
          loading.status = false
        })
    }
  } catch (error) {
    setOpen(true)
    storeModel.value.error_message = error.message
  }

}

</script>

<style scoped>
.list {
  background-color: var(--ion-color-ice-tint);
  border-width: 0;
}
</style>