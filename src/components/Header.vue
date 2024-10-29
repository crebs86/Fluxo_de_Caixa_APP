<template>
    <ion-header>
        <ion-toolbar color="yellow-light">
            <ion-icon :src="left" class="float-left pl-4 pt-1" size="small" @click="goBack"></ion-icon>
            <ion-title>{{ props.title }}</ion-title>
        </ion-toolbar>
    </ion-header>
</template>

<script setup>
import { IonHeader, IonToolbar, IonIcon, IonTitle } from '@ionic/vue';
import left from '../assets/icons/angle-left.svg';
import router from '../router';

const props = defineProps({
    title: String
})

function goBack() {
    router.go(-1)
}

</script>