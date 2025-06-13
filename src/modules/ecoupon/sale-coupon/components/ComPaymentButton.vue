<template>
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
    </ion-card-content>
</ion-card>
</template>
<script setup>

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { ref } from "vue";
 
const {grandTotal, grandTotalSecondCurrency, onPayment } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
</script>