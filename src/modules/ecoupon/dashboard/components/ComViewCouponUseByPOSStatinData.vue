<template>
  <BaseModal :title="t('Revenue vs Coupon Used by Station')">

    <DataTable :value="data" stripedRows>
      <Column :header="t('No.')" headerClass="text-center" bodyClass="text-center" style="width: 60px">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="pos_station" :header="t('POS Station')">
        <template #body="slotProps">
          {{ slotProps.data.pos_station }}
        </template>
      </Column>
      <Column field="total_amount" :header="t('Sale Revenue')" headerClass="text-right" bodyClass="text-right">
        <template #body="slotProps">
          <ComCurrency :value="Math.abs(slotProps.data.total_amount)" />
        </template>
      </Column>

      <Column field="coupon_value" :header="t('Coupon Value')" headerClass="text-right" bodyClass="text-right">
        <template #body="slotProps">
          <ComCurrency :value="Math.abs(slotProps.data.coupon_value)" />
        </template>
      </Column>

      <ColumnGroup type="footer">
        <Row>
          <Column :footer="t('Totals:')" :colspan="2" footerStyle="text-align:right" />
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

import { computed } from 'vue';


const props = defineProps({
  data: Object
})
const t = window.t;
const totalAmount = computed(() => {
  return props.data?.reduce((sum, item) => sum + (Math.abs( item?.total_amount) || 0), 0);
})
const totalCouponValue = computed(() => {
  return props.data?.reduce((sum, item) => sum + (Math.abs( item?.coupon_value) || 0), 0);
})


</script>