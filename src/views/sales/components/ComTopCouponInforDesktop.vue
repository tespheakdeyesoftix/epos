<template>
  <!-- {{ saleProducts }} -->
   <DataTable stripedRows  :value="saleProducts" tableStyle="min-width: 50rem">
  <!-- Index Column -->
  <Column header="#" headerStyle="width:3rem" headerClass="text-center" bodyClass="text-center">
        <template #body="slotProps">
            {{ slotProps.index + 1 }}
        </template>
    </Column>
  <!-- Your Data Columns -->
  <Column field="product_code" :header="t('Description')">
   
       
</Column>
<Column headerClass="text-center" bodyClass="text-center" :header="t('Remaining Amount')">
  <template #body="slotProps">
    <ComCurrency :value="slotProps.data.coupons?.[0]?.balance_amount" />
  </template>
</Column>

<Column headerClass="text-center" bodyClass="text-center" :header="t('Remaining Value')">
  <template #body="slotProps">
    <ComCurrency :value="slotProps.data.coupons?.[0]?.balance_coupon_value" />
  </template>
</Column>



  <Column field="amount" headerClass="text-right" bodyClass="text-right" :header="t('Top Up Amount')">
      <template #body="slotProps">  
        <ComCurrency :value="slotProps.data.amount"/>
      </template>
</Column>

   <Column field="total_coupon_value" headerClass="text-right" bodyClass="text-right" :header="t('Top Up Value')">
      <template #body="slotProps">  
        <ComCurrency :value="slotProps.data.total_coupon_value"/>
      </template>
</Column>

<Column  headerClass="text-right" bodyClass="text-right" :header="t('Total Value')">
      <template #body="slotProps">
        <ComCurrency 
        :value="Math.abs((slotProps.data.coupons?.[0]?.balance_amount || 0) + (slotProps.data.amount || 0))" 
        />
      </template>
</Column>

 <Column headerClass="text-right" bodyClass="text-right" :header="t('Total Amount')">
  <template #body="slotProps">
    <ComCurrency 
      :value="Math.abs((slotProps.data.coupons?.[0]?.balance_coupon_value || 0) + (slotProps.data.total_coupon_value || 0))" 
    />
  </template>
</Column>

</DataTable>
</template> 
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
    const props = defineProps({
        saleProducts:Object
    })
    const t = window.t;
</script>