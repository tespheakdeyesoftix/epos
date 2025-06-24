<template>

    
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button />
          </ion-buttons>
          <ion-title><slot></slot></ion-title>
             
           
      <ion-searchbar
        :search-icon="qrCode"
        :placeholder="t('Check coupon code')"
        style="max-width: 300px;"
        @ionChange="onCheckCouponCode"
        v-model="keyword"

      ></ion-searchbar>
  
           <ion-buttons slot="end">
            <slot name="end"></slot>
 <ComUserProfile />
           </ion-buttons>
         
        </ion-toolbar>
      </ion-header>
 

  </template>
  <script setup lang="ts">
  import {  IonButtons, IonTitle, IonMenuButton } from '@ionic/vue';
 
    import ComUserProfile from "@/views/layouts/ComUserProfile.vue"  
  
    import { useAuth } from '@/hooks/useAuth';
import { qrCode } from 'ionicons/icons';
import { ref } from 'vue';
    const {isAuthenticated} = useAuth();

const t = window.t;
const keyword = ref("")
function onCheckCouponCode(){
  if(keyword.value){
      app.ionRouter.navigate("/coupon-detail/" + app.utils.getCouponNumber(keyword.value) + "?appbar=1")
  }
  keyword.value = ""
}
  </script>
  