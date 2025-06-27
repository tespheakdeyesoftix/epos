<template>
<ion-card  class="icon-no-padding ion-no-margin" color="danger" >
    <ion-card-content>
        <div class="flex justify-content-between align-item-center">

     
        <div>
             <ion-label>
            {{ t('Total') }} ({{ mainCurrency }}) :
            <ComCurrency :value="grandTotal"/> 
        </ion-label>
        <br>
        <ion-label>
            {{ t('Total') }} ({{ second_currency }}) : <ComCurrency :value="grandTotalSecondCurrency" :currency="second_currency"/> 
        </ion-label>
        </div>
       <div>
  <ion-chip style="float: right;">
            <ComCurrency :value="1" :currency="mainCurrency" /> 
            <span class="mx-2"> = </span>
           
        <ComCurrency :value="exchange_rate" :currency="second_currency" /> 
        </ion-chip>
       </div>
   </div>
       
      
        

    </ion-card-content>
</ion-card>

</template>
<script setup>

import { useApp } from "@/hooks/useApp.ts"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { ref } from "vue";
const {exchange_rate} = useApp()
const t = window.t;
const {grandTotal, grandTotalSecondCurrency } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
</script>