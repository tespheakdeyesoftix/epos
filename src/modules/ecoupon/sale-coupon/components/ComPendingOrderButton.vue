

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
const {saleDoc,totalPendingOrder, getTotalPendingOrder } = useSaleCoupon();
onMounted(()=>{
    getTotalPendingOrder()
})

async function onViewPendingOrder(){
    const result = await app.utils.onViewPendingOrder();
    
    if(result){
        if(saleDoc.value.name && saleDoc.value.name  == result.name) return;
        
       
        if(saleDoc.value.sale_products.length>0){
            await app.showWarning("Please save your current order first");
            return
        }

        // open order 
        app.ionRouter.navigate("/sale-coupon/" + result.name,"push","replace")


        
        
    }
    
}
</script>