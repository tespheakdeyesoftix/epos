<template>
   
<DataTable :value="data">
    <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center"  
          style="width: 60px"
            
            >
    <template #body="slotProps">
      {{ slotProps.index + 1 }}
    </template>
  </Column>
    <Column field="payment_method" :header="t('Payment Type')">
    <template #body="slotProps">
        {{ t(slotProps.data.payment_method) }}
    </template>
    </Column>
    <Column field="input_amount" :header="t('Opening Amount')" headerClass="text-right" bodyClass="text-right">
    <template #body="slotProps">
        <ComCurrency :value="slotProps.data.input_amount" :currency="slotProps.data.currency"/>
    </template>
    </Column>
    <Column field="input_system_close_amount" :header="t('System Close Amount')" headerClass="text-right" bodyClass="text-right">
    <template #body="slotProps">
        <ComCurrency :value="slotProps.data.input_system_close_amount" :currency="slotProps.data.currency"/>
    </template>
    </Column>
    <Column field="input_close_amount" :header="t('Close Amount')" headerClass="text-right" bodyClass="text-right">
    <template #body="slotProps">
        <ComCurrency :value="slotProps.data.input_close_amount" :currency="slotProps.data.currency"/>
    </template>
    </Column>
    <Column field="input_different_amount" :header="t('Difference Amount')" headerClass="text-right" bodyClass="text-right">
    <template #body="slotProps">
        <ComCurrency :value="slotProps.data.input_different_amount" :currency="slotProps.data.currency"/>
    </template>
    </Column>

    
</DataTable>

</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const props = defineProps({
    data:Object
})
const t = window.t
</script>