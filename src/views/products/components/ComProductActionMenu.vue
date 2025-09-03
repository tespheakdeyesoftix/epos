<template>
    <ion-content class="ion-padding">

      <ion-list>
         <ion-item button @click="onPrintBarcode()">{{ t("Print Barcode")  }}</ion-item>
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
import { useRouter } from 'vue-router'
const router = useRouter()

function onAdjustment(){
    popoverController.dismiss("", 'confirm');
    app.ionRouter.navigate('/stock-adjustment/' + props.product.name, 'forward', 'replace');
}

function onPrintBarcode(){
    popoverController.dismiss("", 'confirm');
    router.replace({ path: '/barcode/' + props.product.name, force: true })
}
</script>
