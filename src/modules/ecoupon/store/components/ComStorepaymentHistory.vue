<template>
  <DocList
    docType="Store Payment"
    :options="options"
    v-model:selectedRow="selectedRow"
  >
    <template #name="{ item }">
      {{ item.name }}
    </template>
    <template #docstatus="{item}">
                 
                <ComStatus :status="getStatusText(item.docstatus)"/>
            </template>
  </DocList>
   
                 
               
            
</template>

<script setup>
import { ref } from 'vue'


function getStatusText(id){
    return app.utils.getDocStatusText(id);
}
const props = defineProps({
  vendor: String  
})

const selectedRow = ref()

 
const options = {
  columns: [
    { fieldname: "name", header: "Sale #", url: "/store-payment-detail", id_field: "name" },
    // { fieldname: "pos_profile", header: "POS Profile" },
    { fieldname: "posting_date", header: "Date", fieldtype: "Date" },
    // { fieldname: "cashier_shift", header: "Cashier Shift" },
    { fieldname: "vendor_name", header: "Vendor" },
    { fieldname: "payment_amount", header: "Payment Amount", fieldtype: "Currency" },
    // { fieldname: "payment_types", header: "Payment Type" },
    { fieldname: "receive_by", header: "Receive By" },
    // { fieldname: "receive_by_phone_number", header: "Receive By Phone Number" },
    { fieldname: "modified", header: "Last Modified", fieldtype: "Datetime" },
     { fieldname: "docstatus", header: "Status" },
  ],
  fields: [
    "name", "pos_profile", "posting_date", "working_day", "cashier_shift",
    "receive_by", "receive_by_phone_number", "vendor", "vendor_name", "payment_amount", "payment_types"
  ],
  filters: [["vendor", "=", props.vendor]],
  orderBy: {
    field: "modified",
    order: "desc"
  }
}
</script>
