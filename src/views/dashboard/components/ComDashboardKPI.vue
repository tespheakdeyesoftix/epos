<template>
  <stack row itemClass="col-6 sm:col-6 lg:col-3 p-2 " >
    <ComCardKPI mainClass="bg-blue-500" :icon="cashOutline" :isCurrency="true" label="Today Revenue"
      :value="data?.today_revenue" />
   
   <ComCardKPI mainClass="bg-yellow-500" :icon="folderOpenOutline" label="Today Bill / QTY"
      :value="data?.today_bill + ' / ' + data?.today_quantity" />
      <ComCardKPI mainClass="bg-green-500" :icon="cashOutline" label="MTD Revenue"
      :value="data?.mtd_revenue" :isCurrency="true" />
    <ComCardKPI mainClass="bg-red-500" :icon="folderOpenOutline" label="MTD Bill / QTY"
      :value="data?.mtd_bill + ' / ' + data?.mtd_quantity" />
  </stack>

</template>
<script setup>
import { cashOutline, folderOpenOutline, trashBinOutline } from 'ionicons/icons';
import ComCardKPI from './ComCardKPI.vue';
const t = window.t;
const props = defineProps({
  data: Object
}) 
</script>