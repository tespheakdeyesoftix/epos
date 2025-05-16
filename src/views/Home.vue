<template>
  <ion-page>
    <AppBar>{{ t("Home") }}</AppBar>
    <ion-content :fullscreen="true">
        <div class="wrapper-cover flex justify-content-end flex-column align-items-center pb-2">
          <ion-img class="w-4rem" src="/assets/ePOS-logo.png"></ion-img>
          <h1 class="mt-2 mb-0">ePOS Restaurant</h1>
          <ion-text>Device: Hi IOS, Station: Siem Reap</ion-text>
        </div>
        <div class="flex justify-content-center" style="height: calc(100vh - 277.5px);">
          <div class="p-2 w-9 mt-5" style="height: fit-content;">
            <div class="grid">
              <ion-button class="col-6 m-0" color="success" routerLink="/product-list">
                <div class="flex flex-column justify-center items-center">
                  <ion-icon class="text-7xl" :icon="cartOutline" slot="start"></ion-icon>
                  Product
                </div>
              </ion-button> 
              
              <ion-button class="col-6 m-0" color="primary" routerLink="/pending-order">
                <div class="flex flex-column justify-center items-center">
                  <ion-icon class="text-7xl" :icon="timeOutline" slot="start"></ion-icon>
                  Pending Order
                </div>
              </ion-button> 

              <ion-button class="col-6 m-0" color="danger" routerLink="/product-list">
                <div class="flex flex-column justify-center items-center">
                  <ion-icon class="text-7xl" :icon="logOutOutline" slot="start"></ion-icon>
                  Logout
                </div>
              </ion-button> 
            </div>
          </div>
        </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { cartOutline, logOutOutline,timeOutline } from 'ionicons/icons';
  const t = window.t;
</script>
<style>
  .wrapper-cover { 
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                url('/assets/swirl_pattern.png') no-repeat center center / cover;
    width: 100%;
    height: 25%;
    color: #fff;  
  }
</style>