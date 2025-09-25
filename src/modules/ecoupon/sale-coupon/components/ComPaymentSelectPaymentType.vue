<template>
  
   <ion-grid class="ion-no-padding">
  <ion-row>
    <ion-col 
      v-for="p in payment_type"
      :key="index" 
      size="6"
    >
      <ion-button 
        
        size="large"
        expand="block" 
        @click="onAddPayment(p)"
        color="warning"
        style="height:20px; font-size: 16px;"
      >
       {{ t(p.payment_type) }}
      </ion-button>
    </ion-col>
  </ion-row>
</ion-grid>
</template>
<script setup>

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
const { saleDoc, onAddPayment } = useSaleCoupon()
const t = window.t;
const payment_type = app.setting.pos_config.payment_type.filter(x=>!x.sale_type || x.sale_type == saleDoc.value.sale_type);
</script>