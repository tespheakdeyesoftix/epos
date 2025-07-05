<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ t("Payment Breakdown") }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
           <DataTable :value="data">
                <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="sale_type" :header="t('Payment Type')">
                <template #body="slotProps">
                    {{ t(slotProps.data.payment_type) }}
                </template>
                </Column>
                <Column field="total_transaction" :header="t('Total Transaction')" headerClass="text-center"
                    bodyClass="text-center" />
                <Column field="payment_amount" :header="t('Payment Amount')" headerClass="text-right" bodyClass="text-right">
                    <template #body="slotProps">
                        <ComCurrency :value="slotProps.data.payment_amount" :currency="slotProps.data.currency"  />
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
                                <ComCurrency :value="getTotal('base_payment_amount')" />
                         
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
    cashier_shift:String
})
const data = ref()
const t = window.t
async function getData(){
    const res = await app.sql("select payment_type,currency, count(*) as total_transaction, sum(input_amount) as payment_amount,sum(payment_amount) as base_payment_amount from `tabSale Payment` where docstatus=1 and cashier_shift=%(cashier_shift)s group by payment_type,currency",
        {
            cashier_shift: props.cashier_shift
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