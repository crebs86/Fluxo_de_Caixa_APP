<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header title="Novo Fornecedor" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">Novo Fornecedor</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">

            <ion-list class="list">
              <ion-item color="gray-light">
                <ion-input label="Loja" label-placement="floating" color="amber" :value="store?.name"
                  readonly></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Nome" label-placement="floating" color="amber"
                  v-model="supplierModel.name"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="E-mail" type="email" label-placement="floating" color="amber"
                  v-model="supplierModel.email"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Contato 1" type="tel" label-placement="floating" color="amber"
                  v-model="supplierModel.contact1" @keyup="maskPhone($event)" maxlength="15"></ion-input>
              </ion-item>
              <ion-item color="ice">
                <ion-input label="Contato 2" type="tel" label-placement="floating" color="amber"
                  v-model="supplierModel.contact2" @keyup="maskPhone($event)" maxlength="15"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Endereço" type="text" label-placement="floating" color="amber"
                  v-model="supplierModel.address"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="CPF/CNPJ" type="text" label-placement="floating" color="amber"
                  v-model="supplierModel.docs" @keyup="maskDocs($event)" maxlength="18"></ion-input>
              </ion-item>

            </ion-list>

            <ion-button expand="full" color="amber" @click="crateSuppliers()">Criar Fornecedor</ion-button>

            <ion-text v-for="(e, i) in supplierModel.errors?.name" :key="'er_name' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in supplierModel.errors?.email" :key="'er_email' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in supplierModel.errors?.contact1" :key="'er_contact1' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in supplierModel.errors?.contact2" :key="'er_contact2' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in supplierModel.errors?.address" :key="'er_address' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in supplierModel.errors?.docs" :key="'er_docs' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>

          </div>
          <ion-toast :is-open="isOpen" :message="supplierModel.error_message" :duration="3000" position="middle"
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
import { onMounted, ref } from 'vue';
import { email, length } from '../modules/validation';
import api from '../api';
import { useRoute } from 'vue-router';
import { utils } from '../store/utils';
import { goTo } from '../modules/utils';

const loading = utils()

const supplierModel = ref({
  name: '',
  email: '',
  docs: '',
  contact1: '',
  contact2: '',
  address: '',
  store_id: '',
  error_message: '',
  errors: {}
})

const route = useRoute();

const store = ref({});

const isOpen = ref(false);

const setOpen = (state) => {
  isOpen.value = state;
}

const maskPhone = (event) => {
  let input = event.target;
  input.value = phoneMask(input.value);
}

const maskDocs = (event) => {
  let input = event.target;
  input.value = docsMask(input.value)
}

function crateSuppliers() {

  supplierModel.value.errors = {}
  supplierModel.value.error_message = ''
  if (
    length({ value: supplierModel.value.name, min: 3, max: 255, field: 'Nome' })
    , email(supplierModel.value.email) && length({ value: supplierModel.value.email, min: 5, max: 255, field: 'E-mail' })
    , (length({ value: supplierModel.value.contact1, min: 13, max: 14, field: 'Contato 1' }))
    , (!supplierModel.value.contact2 || length({ value: supplierModel.value.contact2, min: 13, max: 14, field: 'Contato 2' }))
    , (!supplierModel.value.address || length({ value: supplierModel.value.address, min: 5, max: 255, field: 'Endereço' }))
    , length({ value: supplierModel.value.docs ? supplierModel.value.docs.match(/\d/g).join("") : '', min: 11, max: 14, field: 'CPF/CNPJ' })
  ) {
    loading.status = true;
    api.post('/suppliers/store/' + store.value.id, supplierModel.value)
      .then((r) => {
        goTo({ name: 'supplier-edit', params: { id: r.data.id } })
      })
      .catch((e) => {
        if (e?.response?.status === 422) {
          supplierModel.value.errors = e?.response?.data.errors
          supplierModel.value.error_message = 'Não foi possível concluir a ação. Verifique os erros abaixo.'
        } else if (e?.response?.status === 401) {
          supplierModel.value.error_message = e?.response?.data.message
        } else {
          supplierModel.value.error_message = 'Ocorreu um erro ao processar solicitação.'
        }
        setOpen(true)
      })
      .finally(() => {
        loading.status = false;
      })
  }

}

onMounted(() => {
  loading.status = true;
  api.get('suppliers/loadStore/' + route.params?.store)
    .then((r) => {
      store.value = r.data[0]
      supplierModel.value.store_id = r.data[0]?.id
    })
    .catch((e) => {
      if (e?.response?.status === 419 || e?.response?.status === 401) {
        supplierModel.value.error_message = e?.response?.data?.message
      } else {
        supplierModel.value.error_message = 'Ocorreu um erro ao processar solicitação.'
      }
      setOpen(true)
    })
    .finally(() => {
      loading.status = false;
    })
})

</script>

<style scoped>
.list {
  background-color: var(--ion-color-ice-tint);
  border-width: 0;
}
</style>