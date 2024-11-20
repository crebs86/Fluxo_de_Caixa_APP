<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header title="Novo Produto" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">Novo Produto</ion-title>
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
                  v-model="productModel.name"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Descrição" label-placement="floating" color="amber"
                  v-model="productModel.description"></ion-input>
              </ion-item>

              <ion-item color="ice">
                <ion-input label="Valor" label-placement="floating" color="amber" v-model="productModel.value"
                  @keyup="maskCurrency($event)">
                </ion-input>
              </ion-item>

            </ion-list>

            <ion-button expand="full" color="amber" @click="crateProduct()">Criar Produto</ion-button>

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

          </div>
          <ion-toast :is-open="isOpen" :message="productModel.error_message" :duration="3000" position="middle"
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
import { currencyMask } from '../modules/mask';
import { onMounted, ref } from 'vue';
import { length } from '../modules/validation';
import api from '../api';
import { useRoute } from 'vue-router';
import { utils } from '../store/utils';
import { goTo } from '../modules/utils';

const loading = utils()

const productModel = ref({
  name: '',
  description: '',
  img: '',
  value: '',
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

const maskCurrency = (event) => {
  let input = event.target;
  productModel.value.value = currencyMask(input.value);
}

function crateProduct() {
  try {
    productModel.value.errors = {}
    productModel.value.error_message = ''
    productModel.value.docs = currencyMask(productModel.value.docs)
    if (
      length({ value: productModel.value.name, min: 3, max: 255, field: 'Nome' })
      , length({ value: productModel.value.description, max: 255, field: 'Descrição' })
      , length({ value: productModel.value.value, min: 4, max: 14, field: 'Valor' })
    ) {
      loading.status = true;
      api.post('/api/products/store/' + store.value.id, productModel.value)
        .then((r) => {
          goTo({ name: 'product-edit', params: { id: r.data.id } })
        })
        .catch((e) => {
          if (e?.response?.status === 422) {
            productModel.value.errors = e?.response?.data?.errors
            productModel.value.error_message = 'Não foi possível concluir a ação. Verifique os erros abaixo.'
          } else if (e?.response?.status === 403) {
            productModel.value.error_message = e?.response?.data
          } else {
            productModel.value.error_message = 'Ocorreu um erro ao processar solicitação.'
          }
          setOpen(true)
        })
        .finally(() => {
          loading.status = false;
        })
    }
  } catch (error) {
    setOpen(true)
    productModel.value.error_message = error.message
  }
}

onMounted(() => {
  loading.status = true;
  api.get('/api/products/loadStore/' + route.params?.store)
    .then((r) => {
      store.value = r.data[0]
      productModel.value.store_id = r.data[0]?.id
    })
    .catch((e) => {
      if (e?.response?.status === 403) {
        productModel.value.error_message = e?.response?.data?.message
      } else {
        productModel.value.error_message = 'Ocorreu um erro ao processar solicitação.'
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