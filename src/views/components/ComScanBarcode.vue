<template>
  <BaseModal title="Scan Barcode">
    <ComScanBarcodeIOS v-if="isPlatform('ios')" />
    <ComScanBarcodeAndroid v-else/>
  </BaseModal>
</template>
<script setup>
import { isPlatform } from '@ionic/vue';
 import ComScanBarcodeAndroid from "@/views/components/ComScanBarcodeAndroid.vue"
 import ComScanBarcodeIOS from "@/views/components/ComScanBarcodeIOS.vue"
</script>