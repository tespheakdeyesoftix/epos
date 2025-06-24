<template>
    <ion-page>
        <AppBar>{{ t("Customer List") }}</AppBar>
        <ion-content ref="contentRef">
            
            <DocList docType="Customer" :options="options"  
                :contentRef="contentRef"
                @onRowDblClick="onRowDblClick"
                >
                    
            </DocList>
           
        </ion-content>
       <ion-fab slot="fixed" horizontal="end" vertical="bottom">
  <ion-fab-button v-tooltip.top="t('Add new customer')" @click="onAddCustomer" >
    <ion-icon :icon="addOutline"></ion-icon>
  </ion-fab-button>
</ion-fab>

    </ion-page>
</template>
<script setup>
import { ref  } from 'vue';
import { addOutline } from "ionicons/icons";
const contentRef = ref(null)
const plateform = ref(app.utils.getPlateform())

const t = window.t
const options = {
   
    columns:[
        {fieldname:"customer_code_name",header:"Customer",url:"/customer-detail",id_field:"name" },
        {fieldname:"customer_name_kh",header:"Name Kh"},
        {fieldname:"gender",header:"Gender"},
        {fieldname:"customer_group",header:"Group"},
        {fieldname:"date_of_birth",header:"Date of Birth"},
        {fieldname:"phone_number",header:"Phone Number"},
        {fieldname:"company_name",header:"Company Name"},
        {fieldname:"address",header:"Location"},
        {fieldname:"modified",header:"Last Modified",fieldtype:"Datetime"},
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name","customer_name_en","customer_name_kh","gender","company_name","address","customer_group","date_of_birth","phone_number","modified"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[["is_disabled","=",0]],

  filterOptions:[
    {fieldname:"customer_group", fieldtype:"Link",options:"Customer Group", label:t('Customer Group'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal'},
    {fieldname:"gender", fieldtype:"Select",options:['Not Set','Male',"Female"], label:t('Gender'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal'},
   
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/customer/" + data.name, "forward", "push");
}
async function onAddCustomer(){
 
    const result = await app.utils.onAddCustomer();
    if(result){
       saleDoc.value.customer = result
      await getCustomer(result)   
    
    }
}

</script>
<style>
    .customer__name::part(native-span){
        justify-content: left !important;
    }
</style>