<template>
     <ion-footer>
<ion-card color="tertiary" button @click="onPayment">
    <ion-card-content>
        <stack row equal >
        
                <span class="title-payment">
                {{ t('Payment') }} 
                </span>
       
        <stack>
  <ion-label>
          {{t('Total')}} ({{ mainCurrency }}) :  <ComCurrency :value="grandTotal"/> 
        </ion-label>
        <ion-label>
           {{t('Total')}} ({{ second_currency }}) : <ComCurrency :value="grandTotalSecondCurrency || 0" :currency="second_currency"/> 
        </ion-label>
        </stack>
      
     
        <ion-chip class="big-chip" color="secondary">
              <ComCurrency :value="1" :currency="mainCurrency" /> <span class="mx-2">=</span>   
        <ComCurrency :value="exchangeRate" :currency="second_currency" /> 
                </ion-chip>
                </stack>
    </ion-card-content>
</ion-card>
</ion-footer>
</template>
<script setup>
const t = window.t;
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { ref } from "vue";
 
const {grandTotal, grandTotalSecondCurrency, onPayment } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
const exchangeRate = app.setting.exchange_rate
</script>
<style scoped>
.big-chip{
    font-size: 20px;
}
.title-payment{
    font-size: 24px;
}
</style>