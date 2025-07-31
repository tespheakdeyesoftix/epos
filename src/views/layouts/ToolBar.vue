<template>
        <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
         <ion-back-button :default-href="defaultHref"></ion-back-button>
        </ion-buttons>
        <ion-title><slot></slot> {{ defaultHref }}</ion-title>
        <ion-buttons slot="end">
          <slot name="end"></slot>
      </ion-buttons>
      </ion-toolbar>
    </ion-header>
</template>
<script setup>
import { ref } from 'vue';

const defaultHref = ref("/home")


const history = window.history
if (history?.state?.back){
  defaultHref.value = history?.state?.back
}
</script>