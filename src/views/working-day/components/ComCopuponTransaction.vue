<template >
<ion-card>
    <ion-card-header>
        <ion-card-title>
            {{ t("Coupon Transaction Summary") }}
        </ion-card-title>
        <ion-card-body>
          
            <DataTable :value="data">
                <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                
                <Column  field="transaction_type" :header="t('Transaction Type')" >
                <template #body="item">
                    {{ t(item.data.transaction_type) }}
                </template>
                </Column>
                <Column  field="total_transaction" :header="t('Total Transaction')" headerClass="text-center" bodyClass="text-center" />
                  <Column field="amount" :header="t('Total Amount')" headerClass="text-right"
                    bodyClass="text-right">
                    <template #body="slotProps">
                        <ComCurrency :value="Math.abs(slotProps.data.amount)"
                            :color="slotProps.data.transaction_type == 'Redeem' ? 'danger' : ''" />
                    </template>
                </Column>
                
                  <Column field="coupon_amount" :header="t('Coupon Amount')" headerClass="text-right"
                    bodyClass="text-right">
                    <template #body="slotProps">
                        <ComCurrency :value="Math.abs(slotProps.data.coupon_amount)"
                            :color="slotProps.data.transaction_type == 'Redeem' ? 'danger' : ''" />
                    </template>
                </Column>
                <ColumnGroup type="footer">
                    <Row>
                        <Column :footer="t('Totals:')" :colspan="2" footerStyle="text-align:right" />
                        <Column footerStyle="text-align:center;font-weight:bold">
                            <template #footer>
                                {{ getTotal('total_transaction') }}
                            </template>
                        </Column>
                        
                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                 <ComCurrency :value="getTotal('amount')"/>
                            </template>
                        </Column>
                        
                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                 <ComCurrency :value="getTotal('coupon_amount')"/>
                            </template>
                        </Column>
                        
                       
                    </Row>
                </ColumnGroup>
                
            </DataTable>
        </ion-card-body>
    </ion-card-header>
</ion-card>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional

const props = defineProps({
    working_day:String

})

const t  = window.t;
const data = ref()
async function getData(){
    data.value = []
    let sql ="select transaction_type,count(*) as total_transaction, sum(actual_amount) as amount, sum(coupon_amount) as coupon_amount from `tabCoupon Transaction` "
    sql = sql + " where working_day = %(working_day)s and status = 'Active' group by transaction_type "
    
    const res = await app.sql(sql,{
        working_day:props.working_day
    })
    if(res.data){
        ["Sale Coupon","Top Up", "Use","Redeem"].forEach(d => {
            
            if(res.data.find(x=>x.transaction_type == d)){
            data.value.push(res.data.find(x=>x.transaction_type == d))    
            }
        });
        
    }
}


function getTotal(field) {
    return data.value?.reduce((sum, item) => sum + (item[field] || 0), 0);
}


 onMounted(async ()=>{
await getData()
})
</script>