<template>
    <ion-card>
        {{ saleDoc.customer }}
    </ion-card>
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
const { saleDoc } = useSaleCoupon()
</script>