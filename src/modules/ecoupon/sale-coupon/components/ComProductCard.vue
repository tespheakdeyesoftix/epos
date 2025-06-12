<template>
<ion-card button @click="onSelectProduct(data)">
    {{ data }}
</ion-card>
    </template>
<script setup>
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const props = defineProps({
    data:Object
})

const {onSelectProduct} = useSaleCoupon()
 

</script>