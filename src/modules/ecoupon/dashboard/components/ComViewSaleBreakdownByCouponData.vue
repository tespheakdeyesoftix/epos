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
    <Column  :header="t('Coupon Type')" >
      <template #body="slotProps">
            {{slotProps.data.product_name}}
        </template>
    </Column>
    <Column field="quantity" :header="t('Quantity')" headerClass="text-center" bodyClass="text-center">
     <template #body="slotProps">
            {{slotProps.data.quantity}}
        </template>
    </Column>
    <Column field="total_amount" :header="t('Sale Revenue')" headerClass="text-right" bodyClass="text-right">
     <template #body="slotProps">
            <ComCurrency :value="slotProps.data.total_amount" />
        </template>
    </Column>
    <Column field="total_coupon_value" :header="t('Coupon Value')" headerClass="text-right" bodyClass="text-right">
     <template #body="slotProps">
            <ComCurrency :value="slotProps.data.total_coupon_value" />
        </template>
    </Column>
      <ColumnGroup type="footer">
            <Row>
                <Column :footer="t('Totals:')" :colspan="2" footerStyle="text-align:right"/>
                <Column footerStyle="text-align:center;font-weight:bold">
                    <template #footer>
       {{totalQuantity}}
      </template>
                </Column>
                <Column footerStyle="text-align:right;font-weight:bold">
                    <template #footer>
        <ComCurrency :value="totalAmount" />
      </template>
                </Column>
                <Column footerStyle="text-align:right;font-weight:bold">
                    <template #footer>
        <ComCurrency :value="totalCouponValue" />
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
const totalQuantity = computed(() => {
    return props.data?.reduce((sum, item) => sum + (item?.quantity ||0), 0);
})
const totalAmount = computed(() => {
    return props.data?.reduce((sum, item) => sum + (item?.total_amount ||0), 0);
})
const totalCouponValue = computed(() => {
    return props.data?.reduce((sum, item) => sum + (item?.total_coupon_value ||0), 0);
})


</script>