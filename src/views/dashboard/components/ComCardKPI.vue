<template>
  <div :class="['col flex   align-items-center border-round-lg shadow-2 gap-2 h-full', mainClass]">
    <div class="flex border-circle p-2" style="background-color: #0000002e !important;">
      <ion-icon :icon="icon" class="text-xl text-white"></ion-icon>
    </div>
    <div class="text-white">
      <div class="text-sm">{{ t(label) }}</div>
      <ion-text >
        <h2>
        <ComCurrency v-if="isCurrency" :value="value" />
        <span v-else>
             {{ value }}
        </span>
      </h2>
      </ion-text>
     
    </div>
  </div>
</template>

<script setup>
import ComCurrency from '@/views/components/public/ComCurrency.vue';
const t = window.t;

defineProps({
  mainClass: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  isCurrency: {
    type: Boolean,
    default: false,
  },
});
</script>
