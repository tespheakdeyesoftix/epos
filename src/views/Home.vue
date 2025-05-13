<template>
  <ion-page>
    <AppBar>{{ t("Home") }}</AppBar>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-button routerLink="/product-list">Product List</ion-button>
  
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  
const t = window.t;
</script>
