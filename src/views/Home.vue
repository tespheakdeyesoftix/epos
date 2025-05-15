<template>
  <ion-page>
    <AppBar>{{ t("Home") }}</AppBar>
    <ion-content :fullscreen="true">
        <div class="wrapper-cover flex justify-content-end flex-column align-items-center">
          <ion-img class="w-4rem" src="/assets/ePOS-logo.png"></ion-img>
          <h1 class="m-2">ePOS Restaurant</h1>
        </div>
        <div>
          <div class="p-2 flex jutify-content-center w-9">
            <div class="grid">
              <ion-button class="col-6 m-0" routerLink="/product-list">
                <div class="flex flex-column justify-center items-center">
                  <ion-icon class="text-7xl" :icon="cartOutline" slot="start"></ion-icon>
                  Product
                </div>
              </ion-button>
              <ion-button class="col-6 m-0" routerLink="/product-list">
                <div class="flex flex-column justify-center items-center">
                  <ion-icon class="text-7xl" :icon="cartOutline" slot="start"></ion-icon>
                  Product
                </div>
              </ion-button>
              <ion-button class="col-6 m-0" routerLink="/product-list">
                <div class="flex flex-column justify-center items-center">
                  <ion-icon class="text-7xl" :icon="cartOutline" slot="start"></ion-icon>
                  Product
                </div>
              </ion-button>
              <ion-button class="col-6 m-0" routerLink="/product-list">
                <div class="flex flex-column justify-center items-center">
                  <ion-icon class="text-7xl" :icon="cartOutline" slot="start"></ion-icon>
                  Product
                </div>
              </ion-button>
            </div>
          </div>
        </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { cartOutline } from 'ionicons/icons';
  const t = window.t;
</script>
<style>
  .wrapper-cover { 
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                url('/assets/cover.jpg') no-repeat center center / cover;
    width: 100%;
    height: 18%;
    color: #fff;  
  }
</style>