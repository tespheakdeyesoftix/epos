<template>
  <stack row itemClass="col-6 sm:col-6 lg:col-3 p-2">
    <ComCardKPI mainClass="bg-blue-500" :icon="cashOutline" :isCurrency="true" label="Total Revenue"
      :value="data?.value?.total_revenue" />
    <ComCardKPI mainClass="bg-green-500" :icon="folderOpenOutline" label="Active Bill / QTY"
      :value="data?.value?.total_active_bill + ' / ' + data?.value?.total_active_quantity" />
    <ComCardKPI mainClass="bg-red-500" :icon="trashBinOutline" label="Deleted Bill / QTY"
      :value="data?.value?.totale_deleted_bill + ' / ' + data?.value?.total_deleted_quantity" />
    <ComCardKPI mainClass="bg-red-500" :icon="trashBinOutline" label="Deleted Bill / QTY"
      :value="data?.value?.totale_deleted_bill + ' / ' + data?.value?.total_deleted_quantity" />
  </stack>

</template>
<script setup>
import { cashOutline, folderOpenOutline, trashBinOutline } from 'ionicons/icons';
import ComCardKPI from './ComCardKPI.vue';

const props = defineProps({
  data: Object
}) 
</script>