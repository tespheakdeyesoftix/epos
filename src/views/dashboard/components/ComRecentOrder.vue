<template>
    <stack row equal>
        <ion-text color="primary">
        <h2>{{ t("Recent Order") }}</h2>
    </ion-text>
    <ion-button style="float: right;" class="mt-2" fill="clear" routerLink="/sale">{{ t("View All") }}</ion-button>
    </stack>
    
   <ComSaleOrderCard v-for="(d,index) in data" :key="index" :data="d"/> 
   <ion-button  expand="full" fill="clear" routerLink="/sale">{{ t("View all orders") }}</ion-button>
</template>
<script setup>
import ComSaleOrderCard  from "@/views/sales/components/ComSaleOrderCard.vue"
const props = defineProps({
    data:Object
})

const t = window.t;
</script>