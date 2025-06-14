<template>
  
    <ion-button @click="onAddPayment(p)"  v-for="p in payment_type">{{ p.payment_type }}</ion-button>
</template>
<script setup>

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
const {  onAddPayment } = useSaleCoupon()
const t = window.t;
const payment_type = app.setting.pos_config.payment_type;
</script>