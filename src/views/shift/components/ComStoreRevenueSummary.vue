<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ t("Store Revenue Breakdown") }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
        
           <DataTable :value="data" stripedRows >
                <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="pos_profile" :header="t('Store Name')"/> 
                
                <Column field="total_transaction" :header="t('Total Transaction')" headerClass="text-center"
                    bodyClass="text-center" />
                <Column field="total_amount" :header="t('Total Amount')" headerClass="text-right" bodyClass="text-right">
                    <template #body="slotProps">
                        <ComCurrency :value="Math.abs(slotProps.data.total_amount)"   />
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
                                <ComCurrency :value="Math.abs( getTotal('total_amount'))" />
                         
                            </template>
                        </Column>
                          
                        

                    </Row>
                </ColumnGroup>
            </DataTable>

        </ion-card-content>
    </ion-card>
    
</template>
<script setup>
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
const props = defineProps({
    cashier_shift:String,
    working_day:String
})
const data = ref()
const t = window.t
async function getData(){
    let sql = " select  pos_profile , count(*) as total_transaction, sum(actual_amount) as total_amount from `tabCoupon Transaction`  where  transaction_type = 'Used' and  working_day = %(working_day)s   group by pos_profile"
    
    const res = await app.sql(sql,
        {
            working_day: props.working_day || '',
        }
    )
    data.value = res.data
}

function getTotal(field) {
    if (!data.value || data.value.length === 0) return 0;
    return data.value.reduce((acc, item) => acc + (item[field] || 0), 0);
}

onMounted(async ()=>{
    await getData();
})
</script>