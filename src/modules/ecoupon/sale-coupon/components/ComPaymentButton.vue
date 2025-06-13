<template>
<ion-card button @click="onPayment">
    <ion-card-content>
        
        <ion-label>
            <ComCurrency :value="grandTotal"/> 
        </ion-label>
        
        <ion-label>
            <ComCurrency :value="grandTotalSecondCurrency"/> 
        </ion-label>

        <ion-label>
            Payment 
        </ion-label>
    </ion-card-content>
</ion-card>
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
 
const {grandTotal, grandTotalSecondCurrency, onPayment } = useSaleCoupon()

</script>