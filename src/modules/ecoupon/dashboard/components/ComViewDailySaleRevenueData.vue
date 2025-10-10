<template>
    <BaseModal :title="t('Daily Sale Revenue')">
     
        <DataTable :value="data" stripedRows >
            <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center"  
          style="width: 60px"
            
            >
    <template #body="slotProps">
      {{ slotProps.index + 1 }}
    </template>
  </Column>
    <Column field="date" sortable :header="t('Date')" headerClass="text-center" bodyClass="text-center"
      style="width: 100px"
    >
      <template #body="slotProps">
            {{ dayjs(slotProps.data.date).format("DD/MM/YYYY") }}
        </template>
    </Column>
    <Column field="value" sortable :header="t('Sale Revenue')" headerClass="text-right" bodyClass="text-right">
     <template #body="slotProps">
            <ComCurrency :value="slotProps.data.value" />
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

import dayjs from 'dayjs';
import { computed } from 'vue';


const props = defineProps({
    data:Object
})
const t = window.t;
const total = computed(() => {
    return props.data?.reduce((sum, item) => sum + (item?.value ||0), 0);
})

</script>