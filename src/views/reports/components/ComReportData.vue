<template>

  <DataTable :value="data?.filter(item => !Array.isArray(item))" tableStyle="min-width: 50rem" stripedRows >
           <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
    <Column v-for="col of reportColumns" :key="col.field" :field="col.field"
     :header="t(col.label)"
     :headerClass="[`${col.align}`,'p-1','white-space-nowrap']"
     :bodyClass="[`${col.align}`,'p-1','white-space-nowrap']"
     >
        <template #body="slotProps">
            <ComCurrency v-if="col.fieldtype=='Currency'" :value="slotProps.data[col.field]" />
            <ComNumber  v-else-if="col.fieldtype=='Float'" :precision="col.precision" :value="slotProps.data[col.field]" />
            <span  v-else-if="col.fieldtype=='Date'">
                {{dayjs(slotProps.data[col.field]).format("DD/MM/YYYY")}}
            </span> 
            
  
            
            <router-link v-else-if="col.url_field" :to="slotProps.data[col.url_field]">
                {{ slotProps.data[col.field] }}
            </router-link>
            <span v-else>

                <ComStatus v-if="col.field == 'status'" status="Paid"/>
                <template v-else>
                    {{slotProps.data[col.field]}}
                </template>
                
            
            </span>
        </template>
    </Column>
</DataTable>
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { computed } from 'vue';
import dayjs from 'dayjs';

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