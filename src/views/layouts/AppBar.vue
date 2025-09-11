<template>

    
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button />
          </ion-buttons>
          <ion-title><slot></slot></ion-title>
             
          <slot name="search">
 <ion-searchbar
      :search-icon="qrCode"
        :placeholder="t('Check coupon code')"
        style="max-width: 300px;"
        @ionChange="onCheckCouponCode"
        class="ion-hide-sm-down search_bar"
        v-model="keyword"
        
      ></ion-searchbar>
          </slot>
     
  
           <ion-buttons slot="end">
            <ion-button @click="onScanQRCode" shape="round" v-if="isMobile">
                    <ion-icon :icon="scanOutline" slot="icon-only" />
                </ion-button>
            <ComQuickAction   /> 
            <slot name="end"></slot>
                <ComUserProfile />
           </ion-buttons>
         
        </ion-toolbar>
      </ion-header>
 

  </template>
  <script setup lang="ts">
  import {  IonButtons, IonTitle, IonMenuButton } from '@ionic/vue';
 
    import ComUserProfile from "@/views/layouts/ComUserProfile.vue"  
    import ComQuickAction from "@/views/layouts/ComQuickAction.vue"  
  
    import { useAuth } from '@/hooks/useAuth';
import { qrCode, scanOutline } from 'ionicons/icons';
import { ref } from 'vue';
    const {isAuthenticated} = useAuth();

    const isMobile = ref(app.utils.isMobile())

const t = window.t;
const keyword = ref("")
import {onCheckCouponCode} from "@/services/scanner-service.js"

async function onScanQRCode(){
  const result = await app.onScanBarcode();
  if (result) {
    keyword.value = result
    onCheckCouponCode(keyword.value);
  }
}
  </script>
<style scoped>
.search_bar{
  position: absolute;
max-width: 300px;
top: 0;
left: 50%;
transform: translateX(-50%);
}
</style>
  