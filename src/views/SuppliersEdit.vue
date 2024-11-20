<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header :title="canEdit ? 'Editando Fornecedor' : 'Fornecedor'" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">{{ canEdit ? 'Editando Fornecedor' : 'Fornecedor' }}</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">

            <ion-list class="list">
              <ion-item color="gray-light">
                <ion-input label="Loja" label-placement="floating" color="amber" v-model="supplierModel.store.name"
                  readonly></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Nome" label-placement="floating" color="amber" v-model="supplierModel.name"
                  :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="E-mail" type="email" label-placement="floating" color="amber"
                  v-model="supplierModel.email" :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Contato 1" type="tel" label-placement="floating" color="amber"
                  v-model="supplierModel.contact1" @keyup="maskPhone($event)" maxlength="14"
                  :readonly="!canEdit"></ion-input>
              </ion-item>
              <ion-item color="ice">
                <ion-input label="Contato 2" type="tel" label-placement="floating" color="amber"
                  v-model="supplierModel.contact2" @keyup="maskPhone($event)" maxlength="14"
                  :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Endereço" type="text" label-placement="floating" color="amber"
                  v-model="supplierModel.address" :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="CPF/CNPJ" type="text" label-placement="floating" color="amber"
                  v-model="supplierModel.docs" @keyup="maskDocs($event)" maxlength="18"
                  :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-text>Criado em: {{ date(supplierModel.created_at).format('DD/MM/YYYY HH:mm:ss') }}</ion-text>
              </ion-item>
              <ion-item color="ice">
                <ion-text>Atualizado em: {{ date(supplierModel.updated_at).format('DD/MM/YYYY HH:mm:ss') }}</ion-text>
              </ion-item>

            </ion-list>

            <template v-if="canEdit">
              <ion-button expand="full" color="amber" @click="updateSupplier()">Salvar Fornecedor</ion-button>
              <ion-button expand="full" color="danger" @click="canEdit = false">Cancelar Edição</ion-button>
            </template>

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

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
              <ion-fab-button color="amber" @click="canEdit = !canEdit">
                <ion-icon :icon="canEdit ? close : pencil"></ion-icon>
              </ion-fab-button>
            </ion-fab>

          </div>
          <ion-toast :is-open="isOpen" :message="supplierModel.error_message" :duration="3000" position="middle"
            color="danger" @didDismiss="setOpen(false)">
          </ion-toast>

        </ion-content>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, IonToast, IonText, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import Layout from '../components/Layout.vue';
import Header from '../components/Header.vue';
import { phoneMask, docsMask } from '../modules/mask';
import { onMounted, ref } from 'vue';
import { email, length } from '../modules/validation';
import api from '../api';
import { useRoute } from 'vue-router';
import { date } from '../modules/utils';
import { close, pencil } from 'ionicons/icons';
import { utils } from '../store/utils';

const loading = utils();

const supplierModel = ref({
  name: '',
  email: '',
  docs: '',
  contact1: '',
  contact2: '',
  address: '',
  error_message: '',
  errors: {},
  store: { name: '' }
})

const route = useRoute();

const isOpen = ref(false);
const canEdit = ref(false);

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

function updateSupplier() {

  try {
    supplierModel.value.errors = {}
    supplierModel.value.error_message = ''
    supplierModel.value.docs = docsMask(supplierModel.value.docs)
    if (
      length({ value: supplierModel.value.name, min: 3, max: 255, field: 'Nome' })
      , email(supplierModel.value.email) && length({ value: supplierModel.value.email, min: 5, max: 255, field: 'E-mail' })
      , (length({ value: supplierModel.value.contact1, min: 13, max: 14, field: 'Contato 1' }))
      , (!supplierModel.value.contact2 || length({ value: supplierModel.value.contact2, min: 13, max: 14, field: 'Contato 2' }))
      , (!supplierModel.value.address || length({ value: supplierModel.value.address, min: 5, max: 255, field: 'Endereço' }))
      , length({ value: supplierModel.value.docs ? supplierModel.value.docs.match(/\d/g).join("") : '', min: 11, max: 14, field: 'CPF/CNPJ' })
    ) {
      loading.status = true
      api.post('/api/suppliers/supplier/update/' + route.params?.id, supplierModel.value)
        .then((r) => {
          loadSupplier(r)
          canEdit.value = false
        })
        .catch((e) => {
          if (e?.response?.status === 422) {
            supplierModel.value.error_message = e.response?.data?.message
            supplierModel.value.errors = e?.response?.data.errors
            setOpen(true)
          } else if (e?.response?.status === 403) {
            supplierModel.value.error_message = e?.response?.data
            setOpen(true)
          } else {
            supplierModel.value.error_message = 'Não foi possível concluir a ação. Verifique os erros do formulário.'
          }
        })
        .finally(() => {
          loading.status = false
        })
    }
  } catch (error) {
    setOpen(true)
    supplierModel.value.error_message = error.message
  }

}

function loadSupplier(r) {
  supplierModel.value = r.data
  supplierModel.value.error_message = ''
  supplierModel.value.errors = {}
  supplierModel.value.contact1 = supplierModel.value.contact1 ? phoneMask(supplierModel.value.contact1) : null
  supplierModel.value.contact2 = supplierModel.value.contact2 ? phoneMask(supplierModel.value.contact2) : null
  supplierModel.value.docs = docsMask(supplierModel.value.docs)
}

onMounted(() => {
  loading.status = true
  api.get('/api/suppliers/supplier/show/' + route.params?.id)
    .then((r) => {
      loadSupplier(r)
    })
    .catch((e) => {
      console.log(e?.response)
    })
    .finally(() => {
      loading.status = false
    })
})

</script>

<style scoped>
.list {
  background-color: var(--ion-color-ice-tint);
  border-width: 0;
}

ion-fab {
  margin-bottom: 52px;
}
</style>