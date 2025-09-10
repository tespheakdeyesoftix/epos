<template>
        <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
         <ion-back-button :default-href="defaultHref"></ion-back-button>
        </ion-buttons>
        <ion-title><slot></slot></ion-title>
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

const currentRoute = app.route.path;


if (history?.state?.back){
  if(history?.state?.back!=currentRoute){
defaultHref.value = history?.state?.back
  }else {
    defaultHref.value = "/home";
  }
  
}
</script>