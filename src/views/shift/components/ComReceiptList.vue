<template>
    <div class="fix-container">
        <div v-if="loading" style="height: 70vh; display: flex; justify-content: center; align-items: center;">
        <ion-spinner name="crescent"></ion-spinner>
        </div>

        <ion-accordion-group expand="inset" value="Sale Coupon" v-else>
    <ion-accordion v-for="(tran, index) in transactionType" :key="index" :value="tran">
      <ion-item slot="header" color="light">
        <ion-label>{{ t(tran) }}

            <ion-text color="danger"><strong>({{ data?.filter(x=>x.sale_type == tran).length }})</strong></ion-text>
        </ion-label>
      </ion-item>
      <div class="ion-padding" slot="content">
         
<DataTable :value="data?.filter(x=>x.sale_type == tran)"
    stripedRows 
    >
                <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <column field="name" headerClass="text-center" bodyClass="text-center" :header="t('Sale #')">
                <template #body="slotProps">
                    <router-link :to="'/sale-detail/' + slotProps.data.name">
                        {{ slotProps.data.name }}
                    </router-link>
                </template>
                </column>
                <column field="customer" :header="t('Customer')">
                <template #body="slotProps">
                    <router-link :to="'/customer-detail/' + slotProps.data.customer">
                        {{ slotProps.data.customer_name }}
                    </router-link>
                </template>
                </column>
                <column field="total_quantity" :header="t('Quantity')" headerClass="text-center" bodyClass="text-center" /> 
                <!-- sub total -->
                <column field="sub_total" :header="t('Sub Total')" headerClass="text-right" bodyClass="text-right" >
                    <template #body="slotProps">
                        <ComCurrency :value="slotProps.data.sub_total" />
                    </template>
                </column> 
                <!-- total disount -->
                <column field="total_discount" :header="t('Discount')" headerClass="text-right" bodyClass="text-right" >
                    <template #body="slotProps">
                        <ComCurrency :value="slotProps.data.total_discount" />
                    </template>
                </column> 
                
                <column field="grand_total" :header="t('Grand Total')" headerClass="text-right" bodyClass="text-right" >
                    <template #body="slotProps">
                        <ComCurrency :value="slotProps.data.grand_total" />
                    </template>
                </column> 
                
                <column field="total_coupon_value" :header="t('Coupon Value')" headerClass="text-right" bodyClass="text-right" >
                    <template #body="slotProps">
                        <ComCurrency :value="slotProps.data.total_coupon_value" />
                    </template>
                </column> 
                
                <column field="closed_by" :header="t('By')"  >
                    <template #body="slotProps">
                        {{ slotProps.data.closed_by.split("@")[0] }} <br/> 
                        <span v-tooltip.left="`${dayjs(slotProps.data.modified)}`">{{ dayjs(slotProps.data.modified).fromNow() }}</span>    
                    </template>
                </column> 



                
            </DataTable>

      </div>
    </ion-accordion>
    </ion-accordion-group>
 
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import dayjs from 'dayjs';
const props = defineProps({
    cashier_shift: String,
working_day: String,
});

const transactionType = ["Sale Coupon","Top Up","Redeem"]

const loading = ref(true)
const t = window.t;
const data = ref();
async function getData(){
    let filters = [["docstatus", "=", 1]]
    if(props.cashier_shift){
        filters.push(["cashier_shift","=",props.cashier_shift])
    }
    
    if(props.working_day){
        filters.push(["working_day","=",props.working_day])
    }

    const res = await app.getDocList("Sale",{
        filters: filters,
        fields: ["name","sale_type", "sub_total","total_discount", "customer","customer_name" ,
         "total_quantity" , "grand_total",
            "total_coupon_value","closed_by","modified"
        ],
        limit: 1000
    })
    if (res.data) {
        data.value = res.data;
    }   


}

onMounted(async ()=>{
    setTimeout(async ()=>{
await getData();
loading.value = false;
    },1000)
    
})
</script>