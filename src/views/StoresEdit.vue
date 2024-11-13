<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header :title="canEdit ? 'Editando Loja' : 'Loja'" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">{{ canEdit ? 'Editando Loja' : 'Loja' }}</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">

            <ion-list class="list">
              <ion-item color="ice">
                <ion-input label="Nome" label-placement="floating" color="amber" v-model="storeModel.name"
                  :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="E-mail" type="email" label-placement="floating" color="amber"
                  v-model="storeModel.email" :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Contato 1" type="tel" label-placement="floating" color="amber"
                  v-model="storeModel.contact1" @keyup="maskPhone($event)" maxlength="14"
                  :readonly="!canEdit"></ion-input>
              </ion-item>
              <ion-item color="ice">
                <ion-input label="Contato 2" type="tel" label-placement="floating" color="amber"
                  v-model="storeModel.contact2" @keyup="maskPhone($event)" maxlength="14"
                  :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Endereço" type="text" label-placement="floating" color="amber"
                  v-model="storeModel.address" :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="CPF/CNPJ" type="text" label-placement="floating" color="amber"
                  v-model="storeModel.docs" @keyup="maskDocs($event)" maxlength="18" :readonly="!canEdit"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-text>Criado em: {{ date(storeModel.created_at).format('DD/MM/YYYY HH:mm:ss') }}</ion-text>
              </ion-item>
              <ion-item color="ice">
                <ion-text>Atualizado em: {{ date(storeModel.updated_at).format('DD/MM/YYYY HH:mm:ss') }}</ion-text>
              </ion-item>

            </ion-list>

            <template v-if="canEdit">
              <ion-button expand="full" color="amber" @click="updateStore()">Salvar Loja</ion-button>
              <ion-button expand="full" color="danger" @click="canEdit = false">Cancelar Edição</ion-button>
            </template>

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

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
              <ion-fab-button color="amber" @click="canEdit = !canEdit">
                <ion-icon :icon="canEdit ? close : pencil"></ion-icon>
              </ion-fab-button>
            </ion-fab>

          </div>
          <ion-toast :is-open="isOpen" :message="storeModel.error_message" :duration="3000" position="middle"
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

function updateStore() {

  try {
    storeModel.value.errors = {}
    storeModel.value.error_message = ''
    storeModel.value.docs = docsMask(storeModel.value.docs)
    if (
      length({ value: storeModel.value.name, min: 3, max: 255, field: 'Nome' })
      , email(storeModel.value.email) && length({ value: storeModel.value.email, min: 5, max: 255, field: 'E-mail' })
      , (length({ value: storeModel.value.contact1, min: 13, max: 14, field: 'Contato 1' }))
      , (!storeModel.value.contact2 || length({ value: storeModel.value.contact2, min: 13, max: 14, field: 'Contato 2' }))
      , (!storeModel.value.address || length({ value: storeModel.value.address, min: 5, max: 255, field: 'Endereço' }))
      , length({ value: storeModel.value.docs ? storeModel.value.docs.match(/\d/g).join("") : '', min: 11, max: 14, field: 'CPF/CNPJ' })
    ) {
      loading.status = true
      api.post('/api/stores/store/update/' + route.params?.id, storeModel.value)
        .then((r) => {
          loadStore(r)
          canEdit.value = false
        })
        .catch((e) => {
          if (e?.response?.status === 422) {
            storeModel.value.error_message = e.response?.data?.message
            storeModel.value.errors = e?.response?.data.errors
            setOpen(true)
          } else if (e?.response?.status === 419) {
            storeModel.value.error_message = e?.response?.data
            setOpen(true)
          } else {
            storeModel.value.error_message = 'Não foi possível concluir a ação. Verifique os erros do formulário.'
          }
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

function loadStore(r) {
  storeModel.value = r.data
  storeModel.value.error_message = ''
  storeModel.value.errors = {}
  storeModel.value.contact1 = storeModel.value.contact1 ? phoneMask(storeModel.value.contact1) : null
  storeModel.value.contact2 = storeModel.value.contact2 ? phoneMask(storeModel.value.contact2) : null
  storeModel.value.docs = docsMask(storeModel.value.docs)
}

onMounted(() => {
  loading.status = true
  api.get('/api/stores/store/show/' + route.params?.id)
    .then((r) => {
      loadStore(r)
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