<template>
  <ion-page>
    <Layout>
      <template #main>
        <Header title="Fluxo" />
        <ion-content :fullscreen="true" color="ice">
          <ion-header collapse="condense">
            <ion-toolbar color="yellow-light">
              <ion-title size="large">Fluxo</ion-title>
            </ion-toolbar>
          </ion-header>

          <div class="container">

            <ion-button fill="clear">
              <ion-col>
                <ion-row style="display: block">
                  <ion-icon :src="hand_money"></ion-icon>
                </ion-row>
                <ion-row class="ion-text-capitalize">
                  <small>Vender</small>
                </ion-row>
              </ion-col>
            </ion-button>

            <ion-button fill="clear">
              <ion-col>
                <ion-row style="display: block">
                  <ion-icon :src="cart"></ion-icon>
                </ion-row>
                <ion-row class="ion-text-capitalize">
                  <small>Entrada</small>
                </ion-row>
              </ion-col>
            </ion-button>

            <ion-button fill="clear" @click="goTo({ name: 'products' })">
              <ion-col>
                <ion-row style="display: block">
                  <ion-icon :src="basket"></ion-icon>
                </ion-row>
                <ion-row class="ion-text-capitalize">
                  <small>Produtos</small>
                </ion-row>
              </ion-col>
            </ion-button>

            <ion-button fill="clear" @click="goTo({ name: 'suppliers' })">
              <ion-col>
                <ion-row style="display: block">
                  <ion-icon :src="user"></ion-icon>
                </ion-row>
                <ion-row class="ion-text-capitalize">
                  <small style="margin-left: -10px;">Fornecedores</small>
                </ion-row>
              </ion-col>
            </ion-button>

            <ion-button fill="clear">
              <ion-col>
                <ion-row style="display: block">
                  <ion-icon :src="user_group"></ion-icon>
                </ion-row>
                <ion-row class="ion-text-capitalize">
                  <small>Clientes</small>
                </ion-row>
              </ion-col>
            </ion-button>

            <ion-button fill="clear">
              <ion-col>
                <ion-row style="display: block">
                  <ion-icon :src="money"></ion-icon>
                </ion-row>
                <ion-row class="ion-text-capitalize">
                  <small>Fluxo</small>
                </ion-row>
              </ion-col>
            </ion-button>

            <ion-button fill="clear" @click="goTo({ name: 'stores' })">
              <ion-col>
                <ion-row style="display: block">
                  <ion-icon :src="shop"></ion-icon>
                </ion-row>
                <ion-row class="ion-text-capitalize">
                  <small>Lojas</small>
                </ion-row>
              </ion-col>
            </ion-button>

          </div>

        </ion-content>
      </template>
    </Layout>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonRow, IonCol } from '@ionic/vue';
import Layout from '../components/Layout.vue';
import Header from '../components/Header.vue';

import hand_money from '../assets/icons/hand-money.svg';
import user from '../assets/icons/user-circle.svg';
import user_group from '../assets/icons/user-group.svg';
import cart from '../assets/icons/cart-larger.svg';
import money from '../assets/icons/money-bag.svg';
import shop from '../assets/icons/shop.svg';
import basket from '../assets/icons/basket.svg';
import { goTo } from '../modules/utils';


</script>

<style scoped>
ion-icon {
  font-size: 48px;
}

ion-button {
  width: 100px;
}
</style>
