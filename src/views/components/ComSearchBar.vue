<template>
  <div class="flex align-items-center px-2 w-full search__bar" style="background:var(--ion-color-primary);">
    <ion-searchbar
      class="flex-grow border-round-2xl"
      :placeholder="t('Search')"
      @click="expandModal"
      v-model="keyword"
      :debounce="1000"
      @ionInput="onSearch"
    ></ion-searchbar>

    <ion-button fill="clear" @click="onScanBarcode" v-if="showBarcodeScanner">
      <ion-icon slot="icon-only" class="text-white" :icon="scan"></ion-icon>
    </ion-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { scan } from "ionicons/icons";
 
const props = defineProps({
  showBarcodeScanner: Boolean,
});

const emit = defineEmits();
const t = window.t;
const keyword = ref(''); // 🔁 Removed <string> type annotation

function onSearch() {
  emit("onSearch", keyword.value);
}

async function onScanBarcode() {
  const result = await app.onScanBarcode()

  if (result) {
    keyword.value = result;
    emit("onSearch", keyword.value);
  }
}
</script>
