<template>
    <ion-content class="ion-padding">

      <ion-list>
        <ion-item v-if="product.is_inventory_product==1" button @click="onAdjustment()">{{ t("Stock Adjustment")  }}</ion-item>
   
      </ion-list>
    </ion-content>
</template>
<script setup>
const props=defineProps({
    product:Object
})
const t = window.t;
import { popoverController } from '@ionic/vue';
 
function onAdjustment(){

    popoverController.dismiss("", 'confirm');
    app.ionRouter.navigate('/stock-adjustment/' + props.product.name, 'forward', 'replace');
}
</script>
