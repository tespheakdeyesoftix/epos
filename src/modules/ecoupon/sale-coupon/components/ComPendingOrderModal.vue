<template >
  
        <BaseModal :title="t('Pending Order')" @onConfirm="onSelect">
            <DocList docType="Sale" :options="options"
              @onRowDblClick="onSelect"
              v-model:selectedRow="selectedRow"
              >
               <template #name="{ item }">
                  <a class="link" @click="onSelect(item)">
                    {{item.name}}
                  </a>
                </template>

            </DocList>
      
 </BaseModal>
</template>
<script setup>
import { ref } from 'vue';
import { modalController } from '@ionic/vue';
const selectedRow = ref()
const t = window.t
const options = {
     columns:[
        {fieldname:"name",header:"Sale #"},
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
]
}
async function onSelect(item = null){
    if(item)  selectedRow.value = item;
    
    if(!selectedRow.value){
        await app.showWarning("Please select pending order")
        return 
    }

    modalController.dismiss(selectedRow.value, 'confirm');
}
</script>