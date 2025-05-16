<template>

  <div class="flex align-items-center px-2 w-full" style="background:var(--ion-color-primary, #0054e9)">
    <ion-searchbar class="flex-grow" :placeholder="t('Search')" @click="expandModal" v-model="keyword" :debounce="1000"
      @ionInput="onSearch"></ion-searchbar>

    <ion-button fill="clear" @click="onScanBarcode" v-if="showBarcodeScanner">
      <ion-icon slot="icon-only" class="text-white" :icon="scan"></ion-icon>
    </ion-button>
  </div>


</template>

<script setup lang="ts">
import { ref } from "vue";
import { scan } from 'ionicons/icons';
import ComScanBarcode from "@/views/components/ComScanBarcode.vue"
const props = defineProps({
  showBarcodeScanner: Boolean
})
const t = window.t;
const emit = defineEmits();
const keyword = ref<string>('');




function onSearch() {
  emit("onSearch", keyword.value);
}

async function onScanBarcode() {
  const result = await window.openModal({

    component: ComScanBarcode,
    componentProps: {
      title: "Scan Barcode",
    }
  })
  if (result) {
    keyword.value = result
    emit("onSearch", keyword.value);
  }

}

</script>