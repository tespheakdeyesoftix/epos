<template>
    <BaseModal :title="t('Payment Breakdown')">
 
        <DataTable :value="data" stripedRows >
            <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center"  
          style="width: 60px"
            
            >
    <template #body="slotProps">
      {{ slotProps.index + 1 }}
    </template>
  </Column>
    <Column field="payment_type" :header="t('Payment Type')" 
    >
      <template #body="slotProps">
            {{ t(slotProps.data.payment_type) }}
        </template>
    </Column>
    <Column field="input_amount" :header="t('Payment Amount')" headerClass="text-right" bodyClass="text-right">
     <template #body="slotProps">
            <ComCurrency :value="slotProps.data.input_amount" :currency="slotProps.data.currency" />
        </template>
    </Column>
      <ColumnGroup type="footer">
            <Row>
                <Column :footer="t('Totals:')" :colspan="2" footerStyle="text-align:right"/>
                <Column footerStyle="text-align:right;font-weight:bold">
                    <template #footer>
        <ComCurrency :value="total" />
      </template>
                </Column>
                
            </Row>
        </ColumnGroup>

</DataTable>
    </BaseModal>
</template>
<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional

 
import { computed } from 'vue';


const props = defineProps({
    data:Object
})
const t = window.t;
const total = computed(() => {
    return props.data?.reduce((sum, item) => sum + (item?.base_amount ||0), 0);
})

</script>