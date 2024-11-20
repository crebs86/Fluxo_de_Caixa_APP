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
              <ion-text v-if="auth.errors?.email" color="danger">
                <small v-for="(e, i) in auth.errors?.email" :key="'e_err_' + i">{{ e }}</small>
              </ion-text>

              <ion-input label-placement="floating" label="Senha" fill="outline" type="password"
                v-model="data.user.password">
              </ion-input>
              <ion-text v-if="auth.errors?.password" color="danger">
                <small v-for="(e, i) in auth.errors?.password" :key="'p_err_' + i">{{ e }}</small>
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
import api from '../api';

const auth = useAuthStore();

const token = ref('');
const isLoggedIn = ref(false);

const data = reactive({
  user: {
    email: '',
    password: ''
  }
});

const userAuth = async () => {
  auth.clearErrors();
  setOpenLoading(true);
  try {
    await axios.get('/sanctum/csrf-cookie').then(async () => {
      const response = await api.post('/api/login', data.user);
      if (response.data.success) {
        auth.storeUser(response.data.user);
        setOpenLoading(false);
        //router.push('/tabs');
        window.location.href = '/'
      } else {
        console.log('erro no login');
      }/** */
    });
  } catch (e) {
    errorLogin();
    if (e.response?.data?.errors) {
      auth.setErrors(e.response?.data?.errors);
    } else if (typeof e === 'string') {
      auth.setErrors(e);
    }
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

async function checkToken() {
  //console.log('checkToken')
  await api.get('/api/check-token')
    .then((r) => {
      isLoggedIn.value = r.data
    })
    .catch(() => {
      isLoggedIn.value = false
    })
    .finally(() => {

    })
}

onMounted(async () => {

  setOpenLoading(true);
  token.value = auth.user?.currentToken ??
    JSON.parse(localStorage.getItem("user") ?? '{"currentToken": "undefinied!"}')
      ?.currentToken;

  await checkToken()

  if (isLoggedIn.value) {
    console.log('Usuário autenticado, redirecionando...')
    router.push('/');
  } else {
    console.log('Login page...')
  }
  setOpenLoading(false);
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