<template>
    
    <ion-text color="primary">
        <h2>{{ t("Recent Order") }}</h2>
    </ion-text>
   <ComSaleOrderCard v-for="(d,index) in data.value" :key="index" :data="d"/> 
</template>
<script setup>
import ComSaleOrderCard  from "@/views/sales/components/ComSaleOrderCard.vue"
const props = defineProps({
    data:Object
})

const t = window.t;
</script>