<template>
  <stack row itemClass="col-6 sm:col-6 lg:col-3 p-2 " >
    <ComCardKPI mainClass="bg-blue-500" :icon="cashOutline" :isCurrency="true" label="Total Revenue"
      :value="data?.value?.today_revenue" />
   
   <ComCardKPI mainClass="bg-yellow-500" :icon="folderOpenOutline" label="Today Bill / QTY"
      :value="data?.value?.today_bill + ' / ' + data?.value?.today_quantity" />
      <ComCardKPI mainClass="bg-green-500" :icon="cashOutline" label="MTD Revenue"
      :value="data?.value?.mtd_revenue" :isCurrency="true" />
    <ComCardKPI mainClass="bg-red-500" :icon="folderOpenOutline" label="MTD Bill / QTY"
      :value="data?.value?.mtd_bill + ' / ' + data?.value?.mtd_quantity" />
  </stack>

</template>
<script setup>
import { cashOutline, folderOpenOutline, trashBinOutline } from 'ionicons/icons';
import ComCardKPI from './ComCardKPI.vue';

const props = defineProps({
  data: Object
}) 
</script>