<template>
    <stack row equal>
        <ion-text color="primary">
        <h2 style="margin-top: 15px;">{{ t("Recent Order") }}</h2>
    </ion-text>
    <div style="margin-top: 4px;float: right;margin-right: -3px;">
        <ion-button class="mt-2" fill="clear" routerLink="/sale"><div style="font-size: 18px;float: right;margin-right: -10px;margin-left: -10px;">{{ t("View All") }}</div></ion-button>
    </div>
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