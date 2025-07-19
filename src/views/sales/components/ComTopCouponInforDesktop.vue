<template>
 {{ saleProducts }}
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
  <Column
  field="quantity"
  headerClass="text-center"
  bodyClass="text-center"
  :header="t('Quantity')"
>
  <template #body="slotProps">
        
        {{ slotProps.data.quantity }}
      </template>
</Column>

  <Column field="unit" headerClass="text-center" bodyClass="text-center" :header="t('Unit')"></Column>
  <Column field="price" headerClass="text-right" bodyClass="text-right" :header="t('Price')">
      <template #body="slotProps">
        
        <ComCurrency :value="slotProps.data.price"/>
      </template>
</Column>
  <Column field="discount" headerClass="text-center" bodyClass="text-center" :header="t('Discount')">
      <template #body="slotProps">
    
        <ion-chip v-if="slotProps.data.discount_type == 'Percent' && slotProps.data.discount>0">
            {{ slotProps.data.discount }}%
        </ion-chip>
     
    
       <ComCurrency :value="slotProps.data.discount_amount || 0"/>
</template>

    </Column>
   <Column field="total_amount" headerClass="text-right" bodyClass="text-right" :header="t('Total Amount')">
      <template #body="slotProps">
        <ComCurrency :value="Math.abs(slotProps.data.amount)" />
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