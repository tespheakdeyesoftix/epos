<template>
    <h1>Summary</h1>
<ion-card button >
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
        <ComCurrency :value="exchange_rate" :currency="second_currency" /> 

    </ion-card-content>
</ion-card>

</template>
<script setup>

import { useApp } from "@/hooks/useApp.ts"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { ref } from "vue";
const {exchange_rate} = useApp()

const {grandTotal, grandTotalSecondCurrency } = useSaleCoupon()
const second_currency = ref(app.setting.second_currency);
const mainCurrency = ref(app.setting.currency);
</script>