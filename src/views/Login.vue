<template>
  <ion-page>
    <Layout>
      <template #main>
        <ion-header>
          <ion-toolbar color="yellow-light">
            <ion-title>Entrar</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content color="ice">
          <div class="login">
            <div class="container">
              <ion-input label-placement="floating" label="E-mail" fill="outline" placeholder="example@email.com"
                v-model="data.user.email">
              </ion-input>
              <ion-text v-if="store.errors?.email" color="danger">
                <small v-for="(e, i) in store.errors?.email" :key="'e_err_' + i">{{ e }}</small>
              </ion-text>

              <ion-input label-placement="floating" label="Senha" fill="outline" type="password"
                v-model="data.user.password">
              </ion-input>
              <ion-text v-if="store.errors?.password" color="danger">
                <small v-for="(e, i) in store.errors?.password" :key="'p_err_' + i">{{ e }}</small>
              </ion-text>

              <ion-button expand="full" color="amber" @click="userAuth">Entrar</ion-button>
            </div>
          </div>
        </ion-content>

        <ion-toast :is-open="isOpen" message="Erro ao efetuar login." :duration="5000" position="middle" color="danger"
          @didDismiss="setOpen(false)">
        </ion-toast>
        <ion-loading color="green-light" :is-open="isOpenLoading" message="Efetuando login...">
        </ion-loading>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import Layout from '../components/Layout.vue';
import { IonHeader, IonToolbar, IonTitle, IonInput, IonContent, IonPage, IonButton, IonToast, IonText, IonLoading } from '@ionic/vue';
import { useAuthStore } from '../store/useAuthStore';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import router from '../router';

const store = useAuthStore();

const data = reactive({
  user: {
    email: '',
    password: ''
  }
});

const userAuth = async () => {
  store.clearErrors();
  setOpenLoading(true);
  try {
    await axios.get('/sanctum/csrf-cookie').then(async () => {
      const response = await axios.post('api/login', data.user);
      if (response.data.success) {
        store.storeUser(response.data.user);
        setOpenLoading(false);
        router.push('/tabs');
      } else {
        console.log('erro no login');
      }/** */
    });
  } catch (e) {
    errorLogin();
    store.setErrors(e.response.data.errors);
  }
}

function errorLogin() {
  setOpenLoading(false);
  setOpen(true);
}

const isOpen = ref(false);

const setOpen = (state) => {
  isOpen.value = state;
}

const isOpenLoading = ref(false);

const setOpenLoading = (state) => {
  isOpenLoading.value = state;
}

onMounted(() => {
  if (store.user !== '') {
    router.push('/')
  }
})

</script>

<style scoped>
.login {
  padding-top: 25px;
  margin: 0 auto;
}

.container {
  width: 96%;
  max-width: 500px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: 15px;
  display: grid;
}
</style>