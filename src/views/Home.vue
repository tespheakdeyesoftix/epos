<template>
  <ion-page>
    <AppBar>{{ t("Home") }}</AppBar>
    <ion-content :fullscreen="true">
        <div class="wrapper-cover flex justify-content-end flex-column align-items-center pb-5">
          <ion-img class="w-4rem" src="/assets/ePOS-logo.png"></ion-img>
          <h1 class="mt-2 mb-0">{{t("ePOS Restaurant")}}</h1>
          <ion-text>{{t("Device: Hi IOS, Station: Siem Reap")}}</ion-text>
        </div>
        <div class="menu-list flex justify-content-center border-round-top-3xl -mt-4" style="height: calc(-330.5px + 100vh);background:url(/assets/pettern1.png)">
          <div class="p-2 w-9 mt-5" style="height: fit-content;">
            <div class="grid">
              <ion-button class="col-6 m-0 border-round-3xl" color="success" routerLink="/product-list">
                <div class="flex flex-column justify-center align-items-center py-2">
                  <ion-icon class="text-6xl" :icon="cartOutline" slot="start"></ion-icon>
                  {{t("Product")}}
                </div>
              </ion-button> 
              
              <ion-button class="col-6 m-0" color="primary" routerLink="/pending-order">
                <div class="flex flex-column justify-center items-center">
                  <ion-icon class="text-7xl" :icon="timeOutline" slot="start"></ion-icon>
                  Pending Order
                </div>
              </ion-button> 

              <ion-button class="col-6 m-0" color="danger" routerLink="/product-list">
                <div class="flex flex-column justify-center align-items-center py-2">
                  <ion-icon class="text-6xl" :icon="logOutOutline" slot="start"></ion-icon>
                  {{t("Logout")}}
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
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
                url(/assets/home-bg.jpeg) no-repeat center center / cover;
    width: 100%;
    height: 35%;
    color: #fff;  
  }
  .menu-list ion-button{
    --border-radius: 1rem;
  }
</style>