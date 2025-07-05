<template>
   <DataTable :value="data" stripedRows>
    <Column field="name" :header="t('Sale #')" headerClass="text-center" bodyClass="text-center">
     <template #body="slotProps">
        <router-link :to="'/sale-detail/' + slotProps.data.name">{{ slotProps.data.name }}</router-link>
    </template>
    </Column>
    
    <Column :header="t('Customer')" headerClass="text-center" bodyClass="text-center">
     <template #body="slotProps">
        <router-link :to="'/customer-detail/' + slotProps.data.customer">{{ slotProps.data.customer }} - {{ slotProps.data.customer_name }}</router-link>
    </template>
    </Column>


    <Column field="total_quantity" :header="t('Quantity')" headerClass="text-center" bodyClass="text-center">
    <template #body="slotProps">
        {{ Math.abs(slotProps.data.total_quantity) }}
    </template>
    </Column>
    <Column :header="t('Total Amount')" headerClass="text-right" bodyClass="text-right">
     <template #body="slotProps">
        <ComCurrency :value="Math.abs(slotProps.data.grand_total)" />
    </template>
    </Column>
    <Column :header="t('Created By')" >
     <template #body="slotProps">
        {{slotProps.data.owner.split("@")[0]}}
    </template>
    </Column>
    
    <Column :header="t('Created Date')" >
     <template #body="slotProps">
        {{ dayjs(slotProps.data.creation).fromNow() }}
    </template>
    </Column>

    
</DataTable>
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';
    const props = defineProps({
        data:Object
    })
    const t =window.t;
</script>