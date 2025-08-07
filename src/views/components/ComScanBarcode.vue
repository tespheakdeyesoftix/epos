<template>

    <ComScanBarcodeIOS v-if="isPlatform('ios')"  @onScanBarcode="onScanBarcode"/>
    <ComScanBarcodeAndroid v-else  @onScanBarcode="onScanBarcode"/>
    
    

</template>
<script setup>
import { isPlatform } from '@ionic/vue';
 import ComScanBarcodeAndroid from "@/views/components/ComScanBarcodeAndroid.vue"
 import ComScanBarcodeIOS from "@/views/components/ComScanBarcodeIOS.vue"
import { modalController } from '@ionic/vue'
import beep from '/assets/beep.mp3'
const beepSound = new Audio(beep)

 function onScanBarcode(barcode){
  beepSound.currentTime = 0
  beepSound.play()
  modalController.dismiss(barcode, 'confirm')

 }
</script>