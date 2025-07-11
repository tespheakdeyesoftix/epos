<template>
    
<ion-card>
    <ion-card-header>
        <ion-card-title>
            {{ t("Cashier Shift List") }}
        </ion-card-title>
        <ion-card-body>
            <DataTable :value="data">
                <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column :header="t('Cashier Shift #')" field="name">
                <template #body="item">
                        <RouterLink :to="'/shift-detail/' + item.data.name">{{ item.data.name }}</RouterLink>
                </template>
                </Column>
                
               
                <Column field="pos_profile" :header="t('POS Profile')"/>
                <Column :header="t('Opened Date')" headerClass="text-center" bodyClass="text-center">
                <template #body="item">
                        {{ dayjs(item.data.creation).fromNow() }}
                </template>
                </Column>
                
                <Column :header="t('Closed Date')" headerClass="text-center" bodyClass="text-center">
                <template #body="item">
                    <template v-if="item.data.is_closed == 1">
                            {{ dayjs(item.data.creation).fromNow() }}
                    </template>
                        
                </template>
                </Column>
                <Column :header="t('By')">
                <template #body="item">
                    
                    <template v-if="item.data.is_closed == 0">
                            {{ item.data.owner?.split("@")[0] }}
                    </template>
                    
                    <template v-else>
                            {{ item.data.closed_by?.split("@")[0] }}
                    </template>

                        
                </template>
                </Column>
                <Column :header="t('Status')" >
                <template #body="item">
                    <ComStatus status="Closed" v-if="item.data.is_closed==1" />
                    <ComStatus status="Opened" v-else/>
                </template>
                </Column>


                
                 
                
            </DataTable>
        </ion-card-body>
    </ion-card-header>
</ion-card>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';
import { dataTool } from 'echarts';
  
const t = window.t;

const props = defineProps({
    working_day:String
})
 
const data = ref()
async function getData(){
    let sql = "select name,posting_date,pos_profile, closed_by, creation, closed_date,is_closed,owner from `tabCashier Shift` where working_day = %(working_day)s"
    const res = await app.sql(sql,{working_day:props.working_day})
    if(res.data){
        data.value = res.data;
    }
}
onMounted(async ()=>{
    await getData()
})
</script>