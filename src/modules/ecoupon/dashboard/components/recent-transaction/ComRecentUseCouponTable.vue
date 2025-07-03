<template>
    <DataTable :value="data" stripedRows>
       
        <Column field="sale" :header="t('Sale #')" headerClass="text-left" bodyClass="text-left">
            <template #body="slotProps">
                <router-link :to="'/sale-detail/' + slotProps.data.sale" v-if="slotProps.data.sale">
                    {{ slotProps.data.sale }}
                </router-link>
            </template>
        </Column>
        
      
        <Column :header="t('Customer')" headerClass="text-justify" bodyClass="text-justify">
            <template #body="slotProps">
                <router-link :to="'/customer-detail/' + slotProps.data.customer">
                    {{ slotProps.data.customer }} - {{ slotProps.data.customer_name }}
                </router-link>
            </template>
        </Column>
        
       
        <Column :header="t('Coupon Number')" headerClass="text-center" bodyClass="text-center">
            <template #body="slotProps">
                <router-link :to="'/coupon-detail/' + slotProps.data.coupon_code">
                    {{ slotProps.data.coupon_number }}
                </router-link>
            </template>
        </Column>
        
       
        <Column :header="t('Posting Date')" headerClass="text-center" bodyClass="text-center">
            <template #body="slotProps">
                {{ dayjs(slotProps.data.posting_date).format('DD/MM/YYYY') }}
            </template>
        </Column>
        
        
        <Column :header="t('POS Station')" headerClass="text-center" bodyClass="text-center">
            <template #body="slotProps">
                {{ slotProps.data.pos_station }}
            </template>
        </Column>
        
   
        <Column :header="t('Actual Amount')" headerClass="text-right" bodyClass="text-right">
            <template #body="slotProps">
               <ComCurrency :value="Math.abs(slotProps.data.actual_amount)"/>
            </template>
        </Column>
        
        
        <Column :header="t('Coupon Amount')" headerClass="text-right" bodyClass="text-right">
            <template #body="slotProps">
               <ComCurrency :value="Math.abs(slotProps.data.coupon_amount)"/>
            </template>
        </Column>
        <Column :header="t('Created Date')" headerClass="text-right" bodyClass="text-right">
             <template #body="slotProps">
        {{ dayjs(slotProps.data.creation).fromNow() }}
        </template>
        </Column>
        <Column :header="t('Created By')" headerClass="text-center" bodyClass="text-center">
            <template #body="slotProps">
                {{slotProps.data.owner.split("@")[0]}}
            </template>
         </Column>
    </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ComCurrency from '@/views/components/public/ComCurrency.vue';
import dayjs from 'dayjs';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
})

const t = window.t;
</script>

<style scoped>

.text-justify-custom {
    text-align: justify !important;
    text-justify: inter-word;
    hyphens: auto;
}
</style>