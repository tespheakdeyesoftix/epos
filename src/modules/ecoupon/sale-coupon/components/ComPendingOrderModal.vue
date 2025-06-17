<template>
  
        <BaseModal :title="t('Pending Order')">
            <DocList docType="Sale" :options="options">
            </DocList>
      
 </BaseModal>
</template>
<script setup>
import { ref } from 'vue';
const t = window.t
const options = {
     columns:[
        {fieldname:"name",header:"Sale #"},
        {fieldname:"customer_name",header:"Customer"},
        {fieldname:"total_quantity",header:"Quantity",fieldtype:"Float"},
        {fieldname:"grand_total",header:"Total Amount",fieldtype:"Currency"},
        {fieldname:"modified_by",header:"User"},
        {fieldname:"modified",header:"Modified Date",fieldtype:"datetime"}
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name", "posting_date","total_quantity", "grand_total", "customer", "customer_name",  "tbl_number","modified","modified_by"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  
  filters:[["docstatus","=",0],["sale_status","=",'Hold Order']],

  filterOptions:[
    // {fieldname:"posting_date", fieldtype:"Date", label:t('Sale Date'),clear:true,modal_type:'sheet_modal'},
]
}
</script>