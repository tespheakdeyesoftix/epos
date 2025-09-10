<template>
    <ion-page>
        <AppBar>{{ t("Sale") }}</AppBar>
        <ion-content>
            <DocList docType="Sale" :options="options">
                <template v-slot:default="{ item }">
                    <ComSaleOrderCard v-for="(d,index) in item" :key="index"  :data="d"/>
                </template>
            </DocList>
        </ion-content>
    </ion-page>
</template>
<script setup>
import ComSaleOrderCard from '@/views/sales/components/ComSaleOrderCard.vue'; 
const t = window.t
const options = {
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name", "posting_date", "grand_total", "customer", "customer_name", "closed_date", "closed_by", "tbl_number","custom_bill_number"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[["docstatus","=",1]],

  filterOptions:[
    {fieldname:"posting_date", fieldtype:"Date", label:t('Sale Date'),clear:true,modal_type:'sheet_modal'},
    {fieldname:"pos_profile", fieldtype:"Link",options:"POS Profile", label:t('POS Profile')},
    {fieldname:"working_day", fieldtype:"Link",options:"Working Day", label:t("Working Day")},
    {fieldname:"cashier_shift", fieldtype:"Link",options:"Cashier Shift", label:t("Cashier Shift")},
    {fieldname:"outlet", fieldtype:"Link",options:"Outlet", label:t("Outlet")},
  ]
}
</script>