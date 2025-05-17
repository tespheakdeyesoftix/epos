<template>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item button @click="onAdjustment()">{{ t("Stock Adjustment") }} {{ product_code }}</ion-item>
   
      </ion-list>
    </ion-content>
</template>
<script setup>
const props=defineProps({
    product_code:String
})
const t = window.t;
import { popoverController } from '@ionic/vue';
 
function onAdjustment(){

    popoverController.dismiss("", 'confirm');
    app.ionRouter.navigate('/stock-adjustment/' + props.product_code, 'forward', 'replace');
}
</script>
