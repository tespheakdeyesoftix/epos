<template>
  <div :class="['col flex gap-2 p-2 align-items-center border-round-lg shadow-2 m-1', mainClass]">
    <div class="flex border-circle p-2" style="background-color: #0000002e !important;">
      <ion-icon :icon="icon" class="text-xl text-white"></ion-icon>
    </div>
    <div class="text-white">
      <div class="text-sm">{{ label }}</div>
      <div class="text-md font-semibold">
        <ComCurrency v-if="isCurrency" :value="value" />
        <span v-else>
             {{ value }}
        </span>
       </div>
    </div>
  </div>
</template>

<script setup>
import ComCurrency from '@/views/components/public/ComCurrency.vue';


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
