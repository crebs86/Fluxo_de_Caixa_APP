<template>
    <slot name="main"></slot>
    <ion-loading spinner="lines" message="Carregando..." class="loading" :is-open="loading.getLoadStatus">
    </ion-loading>
</template>
<script setup>
import { IonLoading } from '@ionic/vue';
import { utils } from '../store/utils';

const loading = utils()

</script>
<style scoped>
ion-loading.loading {
    --background: var(--ion-color-ice);
    --spinner-color: #1c6dff;
    color: #1c6dff;
}
</style>
