<template>
    <ion-page>
        <AppBar>{{ t("Store List") }}</AppBar>
        <ion-content ref="contentRef">
            <DocList docType="Vendor" :options="options"
            v-model:selectedRow="selectedRow"
            @onRowDblClick="onRowDblClick"
            :contentRef="contentRef"
            ref="docListRef"
            
            >
            </DocList>
        </ion-content>
        <ComFooter class="ion-hide-sm-down">
            <ion-button :disabled="!selectedRow" :routerLink="'/store-detail/' + selectedRow?.name">{{ t("View Detail") }}</ion-button>
         
        </ComFooter>
    </ion-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
 
 const contentRef = ref(null)
 const docListRef = ref(null)
 const selectedRow = ref()
 
const t = window.t
const options = {
    columns:[
        {fieldname:"name",header:"Store #",url:"/store-detail"},
        {fieldname:"vendor_name",header:"Store Name"},
        {fieldname:"vendor_group",header:"Group"},
        {fieldname:"contact_name",header:"Contact Name"},
        {fieldname:"phone_number",header:"Phone Number"},
        {fieldname:"store_payment_balance",header:"Total Credit Amount",fieldtype:"Currency"},
        {fieldname:"modified",header:"Last Modified",fieldtype:"Datetime"},
         
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[["vendor_type","=","Internal" ]],

  filterOptions:[
    
  ],
//     noRecordActions:[
//    {title:t("Create New Redeem"),router_link:"/redeem","color":"primary"},
// ]
}
 

function onRowDblClick(data){
    app.ionRouter.navigate("/store-detail/" + data.name, "forward", "push");
}
  
  onMounted(()=>{
    // run update store credit balace
    app.getApi("epos_restaurant_2023.purchasing.doctype.vendor.vendor.update_store_payment_balance")
  })
</script>