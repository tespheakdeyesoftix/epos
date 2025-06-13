<template>
   
    <ion-Selected button>
         {{ saleDoc.customer }}
    </ion-Selected>
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
const { saleDoc } = useSaleCoupon()


</script>