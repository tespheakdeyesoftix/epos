<template >
  
      <ion-page>
        <AppBar>
            {{ t("Pending Order") }}
        </AppBar>
        <ion-content>
          
<DocList docType="Sale" :options="options"
              @onRowDblClick="onSelect"
              v-model:selectedRow="selectedRow"
              >
               

            </DocList>
        </ion-content>
      </ion-page>
            
      
 
</template>
<script setup>
import { ref } from 'vue';
 
const selectedRow = ref()
const t = window.t
const options = {
     columns:[
        {fieldname:"name",header:"Sale #",url:"/sale-coupon"},
        {fieldname:"customer_name",header:"Customer"},
        {fieldname:"total_quantity",header:"Quantity",fieldtype:"Float"},
        {fieldname:"grand_total",header:"Total Amount",fieldtype:"Currency"},
        {fieldname:"modified_by",header:"User"},
        {fieldname:"modified",header:"Modified Date",fieldtype:"Datetime"}
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name", "posting_date","total_quantity", "grand_total", "customer", "customer_name",  "tbl_number","modified","modified_by"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  
  filters:[["docstatus","=",0]],

  filterOptions:[
    // {fieldname:"posting_date", fieldtype:"Date", label:t('Sale Date'),clear:true,modal_type:'sheet_modal'},
],
noRecordActions:[
   {title:t("Create New Sale Coupon"),router_link:"/sale-coupon","color":"primary"},
]
}
async function onSelect(item = null){
  
     
   
    app.ionRouter.navigation("/sale-coupon/" + item.name,"forward","replace")

    
}
</script>