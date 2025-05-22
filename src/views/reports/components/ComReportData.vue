<template>

  <DataTable :value="data?.filter(item => !Array.isArray(item))" tableStyle="min-width: 50rem" stripedRows >
    <Column v-for="col of reportColumns" :key="col.field" :field="col.field"
     :header="t(col.label)"
     :headerClass="col.align"
     :bodyClass="col.align"
     >
        <template #body="slotProps">
            <ComCurrency v-if="col.fieldtype=='Currency'" :value="slotProps.data[col.field]" />
            <ComNumber  v-else-if="col.fieldtype=='Float'" :precision="col.precision" :value="slotProps.data[col.field]" />
            <span v-else>{{slotProps.data[col.field]}}</span>
        </template>
    </Column>
</DataTable>
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { computed } from 'vue';

const props = defineProps({
    data:Object,
    columns:Object,
    
})
const reportColumns = computed(()=>{
    if(props.columns){
        return  props.columns.map(({ fieldname,align, ...rest }) => ({
  ...rest,
  field: fieldname,
  align:getAligment(align)
}));

    }
    return []
})

const t = window.t;

function getAligment(align){
    if(align=='center') return 'text-center'
    if(align=='right') return 'text-right'
    return "text-left"
}
</script>