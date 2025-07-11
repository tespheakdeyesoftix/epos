<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>
                {{ t("Sale Summary") }}
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
           
            <DataTable :value="data">
                <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="sale_type" :header="t('Transaction Type')">
                <template #body="slotProps">
                    {{ t(slotProps.data.sale_type) }}
                </template>
                </Column>
                <Column field="total_bill" :header="t('Total Bill')" headerClass="text-center"
                    bodyClass="text-center" />
                <Column field="total_coupon" :header="t('Total Coupon')" headerClass="text-center"
                    bodyClass="text-center" />
                <Column field="sub_total" :header="t('Sub Total')" headerClass="text-right" bodyClass="text-right">
                    <template #body="slotProps">
                        <ComCurrency :value="Math.abs(slotProps.data.sub_total)"
                            :color="slotProps.data.sale_type == 'Redeem' ? 'danger' : ''" />
                    </template>
                </Column>
                <Column field="total_discount" :header="t('Discount')" headerClass="text-right" bodyClass="text-right">
                    <template #body="slotProps">
                        <ComCurrency :value="Math.abs(slotProps.data.total_discount)"
                            :color="slotProps.data.sale_type == 'Redeem' ? 'danger' : ''" />
                    </template>
                </Column>

                <Column field="total_amount" :header="t('Total Amount')" headerClass="text-right"
                    bodyClass="text-right">
                    <template #body="slotProps">
                        <ComCurrency :value="Math.abs(slotProps.data.total_amount)"
                            :color="slotProps.data.sale_type == 'Redeem' ? 'danger' : ''" />
                    </template>
                </Column>
                <Column field="coupon_value" :header="t('Coupon Value')" headerClass="text-right"
                    bodyClass="text-right">
                    <template #body="slotProps">

                        <ComCurrency :value="Math.abs(slotProps.data.coupon_value)"
                            :color="slotProps.data.sale_type == 'Redeem' ? 'danger' : ''" />
                    </template>
                </Column>

                <ColumnGroup type="footer">
                    <Row>
                        <Column :footer="t('Totals:')" :colspan="2" footerStyle="text-align:right" />
                        <Column footerStyle="text-align:center;font-weight:bold">
                            <template #footer>
                                {{ getTotal('total_bill') }}
                            </template>
                        </Column>
                        <Column footerStyle="text-align:center;font-weight:bold">
                            <template #footer>
                                {{ getTotal('total_coupon') }}
                            </template>
                        </Column>
                        
                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                 <ComCurrency :value="getTotal('sub_total')"/>
                            </template>
                        </Column>
                        
                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                 <ComCurrency :value="getTotal('total_discount')"/>
                            </template>
                        </Column>
                        
                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                 <ComCurrency :value="getTotal('total_amount')"/>
                            </template>
                        </Column>
                        
                        <Column footerStyle="text-align:right;font-weight:bold">
                            <template #footer>
                                 <ComCurrency :value="getTotal('coupon_value')"/>
                            </template>
                        </Column>




                        

                    </Row>
                </ColumnGroup>
            </DataTable>

        </ion-card-content>
    </ion-card>
</template>
<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional

import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    cashier_shift: String,
    working_day:String
})
const data = ref()
const t = window.t;
async function getData() {
    const res = await app.getApi("epos_restaurant_2023.api.mobile.coupon_cashier_shift.get_sale_summary", {
        cashier_shift: props.cashier_shift,
        working_day:props.working_day
    })
    if (res.data) {
        data.value = res.data
    }
}

function getTotal(field) {
    return data.value?.reduce((sum, item) => sum + (item[field] || 0), 0);
}


onMounted(async () => {
    await getData()
})


</script>