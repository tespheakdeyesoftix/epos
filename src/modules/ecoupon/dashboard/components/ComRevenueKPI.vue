<template>
 
  <stack row itemClass="col-6 sm:col-6 lg:col-3 p-2 " >
    <ComCardKPI mainClass="bg-blue-500" :isCurrency="true" label="Today Revenue"
      :value="data?.today_revenue || 0" />
   
   <ComCardKPI mainClass="bg-yellow-500"  label="Today Bill / Total Coupon"
      :value="(data?.today_coupon_bill || 0) + ' / ' + (data?.today_coupon_quantity || 0)" />
      <ComCardKPI mainClass="bg-green-500" label="MTD Revenue"
      :value="data?.mtd_revenue || 0" :isCurrency="true" />
    <ComCardKPI mainClass="bg-red-500" label="MTD Bill / QTY"
      :value="(data?.mtd_coupon_bill || 0) + ' / ' + (data?.mtd_coupon_quantity || 0)" />
  </stack>
 
</template>
<script setup>
 
import ComCardKPI from '@/views/dashboard/components/ComCardKPI.vue';
const t = window.t;
const props = defineProps({
  data: Object
}) 
</script>