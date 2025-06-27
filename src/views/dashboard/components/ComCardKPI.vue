<template>
  <div :class="['col flex align-items-center border-round-lg shadow-2 gap-2 block-height', mainClass]">
    <div v-if="icon" class="flex border-circle p-2" style="background-color: #0000002e !important;">
      <ion-icon :icon="icon" class="text-xl text-white"></ion-icon>
    </div>
    <div class="text-white" style="width: 100%;">
      <div style="text-align: center;" class="label">{{ t(label) }}</div>
      <div class="text-lg font-semibold" style="margin-top: 5px;">
        <div v-if="isCurrency" class="data" style="text-align: center;">
          <ComCurrency :value="value || 0" />
        </div>
        <div style="text-align: center;" class="data" v-else>
             {{ value || 0 }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.label {
  font-size: 16px;font-weight: bold;
}

.data {
  font-size: 18px;font-weight: bold;
}

.block-height{
  height: 80px;
}
</style>
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
