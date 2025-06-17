

<template>
    <div style="position: relative;margin-right: 10px;">

   
    <ion-button size="large" shape="round"   @click="onViewPendingOrder" >
        <ion-icon slot="icon-only" :icon="cartOutline" /> 
        
       
    </ion-button>
    <ion-badge v-if="totalPendingOrder>0" color="danger" style="position: absolute; top:-4px; right: -5px;" >  {{ totalPendingOrder }}</ion-badge>
     </div>
</template>
<script setup lang="ts">
import { cartOutline } from 'ionicons/icons';

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { onMounted, ref } from "vue";
const {totalPendingOrder, getTotalPendingOrder } = useSaleCoupon();
onMounted(()=>{
    getTotalPendingOrder()
})

async function onViewPendingOrder(){
    const result = await app.utils.onViewPendingOrder();
    
}
</script>