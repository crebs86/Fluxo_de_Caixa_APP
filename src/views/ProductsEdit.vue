<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header :title="canEdit ? 'Editando Produto' : 'Produto'" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">{{ canEdit ? 'Editando Produto' : 'Produto' }}</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">

            <ion-list class="list">
              <ion-item color="gray-light">
                <ion-input label="Loja" label-placement="floating" color="amber" :value="productModel.store.name"
                  readonly></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Nome" label-placement="floating" color="amber" v-model="productModel.name"
                  :readonly="!canEdit">
                </ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Descrição" label-placement="floating" color="amber" v-model="productModel.description"
                  :readonly="!canEdit">
                </ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Valor" label-placement="floating" color="amber" v-model="productModel.value"
                  :readonly="!canEdit" @keyup="maskCurrency($event)">
                </ion-input>
              </ion-item>
              
              <ion-item color="gray-light">
                <ion-input label="Criado em" label-placement="floating" color="amber" :value="date(productModel.created_at).format('DD/MM/YYYY HH:mm:ss')"
                  readonly>
                </ion-input>
              </ion-item>
              
              <ion-item color="gray-light">
                <ion-input label="Atualizado em" label-placement="floating" color="amber" :value="date(productModel.updated_at).format('DD/MM/YYYY HH:mm:ss')"
                  readonly>
                </ion-input>
              </ion-item>

            </ion-list>
            
            <template v-if="canEdit">
              <ion-button expand="full" color="amber" @click="updateSupplier()">Salvar Produto</ion-button>
              <ion-button expand="full" color="danger" @click="canEdit = false">Cancelar Edição</ion-button>
            </template>

            <ion-text v-for="(e, i) in productModel.errors?.name" :key="'er_name' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in productModel.errors?.description" :key="'er_description' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in productModel.errors?.img" :key="'er_img' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in productModel.errors?.value" :key="'er_value' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>
            <ion-text v-for="(e, i) in productModel.errors?.store_id" :key="'er_store_id' + i">
              <small class="small-text-danger">{{ e }}</small><br>
            </ion-text>

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
              <ion-fab-button color="amber" @click="canEdit = !canEdit">
                <ion-icon :icon="canEdit ? close : pencil"></ion-icon>
              </ion-fab-button>
            </ion-fab>

          </div>
          <ion-toast :is-open="isOpen" :message="productModel.error_message" :duration="3000" position="middle"
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
import { currencyMask } from '../modules/mask';
import { onMounted, ref } from 'vue';
import { length } from '../modules/validation';
import api from '../api';
import { useRoute } from 'vue-router';
import { date } from '../modules/utils';
import { close, pencil } from 'ionicons/icons';
import { utils } from '../store/utils';

const loading = utils();

const productModel = ref({
  name: '',
  description: '',
  img: '',
  value: '',
  store_id: '',
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

const maskCurrency = (event) => {
  let input = event.target;
  productModel.value.value = currencyMask(input.value);
}

function updateSupplier() {

  try {
    productModel.value.errors = {}
    productModel.value.error_message = ''
    productModel.value.docs = currencyMask(productModel.value.docs)
    if (
      length({ value: productModel.value.name, min: 3, max: 255, field: 'Nome' })
      , length({ value: productModel.value.description, max: 255, field: 'Descrição' })
      , length({ value: productModel.value.value, min: 4, max: 14, field: 'Valor' })
    ) {
      loading.status = true
      api.post('/api/products/update/' + route.params?.id, productModel.value)
        .then((r) => {
          loadSupplier(r)
          canEdit.value = false
        })
        .catch((e) => {
          if (e?.response?.status === 422) {
            productModel.value.error_message = e.response?.data?.message
            productModel.value.errors = e?.response?.data.errors
            setOpen(true)
          } else if (e?.response?.status === 403) {
            productModel.value.error_message = e?.response?.data
            setOpen(true)
          } else {
            productModel.value.error_message = 'Não foi possível concluir a ação. Verifique os erros do formulário.'
          }
        })
        .finally(() => {
          loading.status = false
        })
    }
  } catch (error) {
    setOpen(true)
    productModel.value.error_message = error.message
  }

}

function loadSupplier(r) {
  productModel.value = r.data
  productModel.value.error_message = ''
  productModel.value.errors = {}
  productModel.value.value = currencyMask(productModel.value.value)
}

onMounted(() => {
  loading.status = true
  api.get('/api/products/show/' + route.params?.id)
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