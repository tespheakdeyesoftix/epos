<template>
     <ion-footer>
<ion-card button @click="onPayment">
    <ion-card-content>
        
        <ion-label>
            <ComCurrency :value="grandTotal"/> 
        </ion-label>
        
        <ion-label>
            <ComCurrency :value="grandTotalSecondCurrency" :currency="second_currency"/> 
        </ion-label>

        <ion-label>
            Payment 
        </ion-label>

        exchange_rate: 
        <ComCurrency :value="1" :currency="mainCurrency" /> = 
        <ComCurrency :value="exchangeRate" :currency="second_currency" /> 

    </ion-card-content>
</ion-card>
</ion-footer>
</template>
<script setup>

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { ref } from "vue";
 
const {grandTotal, grandTotalSecondCurrency, onPayment } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
const exchangeRate = app.setting.exchange_rate
</script>