<template>
    <ion-page>
        <AppBar>{{ t("Customer List") }}</AppBar>
        <ion-content>
            <ion-button 
                    shape="round" 
                    fill="solid"  
                    v-tooltip.top="t('Add new customer')"  
                    color="primary"  
                    style="position: fixed; bottom: 20px; right: 20px; z-index: 999;"
                    @click="onAddCustomer">
                <ion-icon :icon="addOutline" slot="icon-only"></ion-icon>
            </ion-button>
            <DocList docType="Customer" :options="options"
                @onRowDblClick="onRowDblClick"
                >
                    <template #name="{ item, index }">
                        <ion-button class="ion-no-margin" fill="clear" :routerLink="'sale-detail/' + item.name">
                            {{item.name}} - {{ item.customer_name_en }}
                        </ion-button>
                    </template>
                    <template v-if="plateform == 'mobile'" v-slot:default="{ item }">
                        <ComTopUpCard v-for="(d,index) in item" :key="index"  :data="d"/>
                    </template>
            </DocList>
            
        </ion-content>
        
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import { addOutline } from "ionicons/icons";

import ComAddCustomer from "@/views/customer/components/ComAddCustomer.vue"
const plateform = ref(app.utils.getPlateform())

const t = window.t
const options = {
    columns:[
        {fieldname:"name",header:"Customer #"},
        {fieldname:"customer_name_kh",header:"Name Kh"},
        {fieldname:"gender",header:"Gender"},
        {fieldname:"customer_group",header:"Group"},
        {fieldname:"date_of_birth",header:"Date of Birth"},
        {fieldname:"phone_number",header:"Phone"},
        {fieldname:"company_name",header:"Company Name"},
        {fieldname:"address",header:"Location "},
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
   
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/customer/" + data.name, "forward", "push");
}
async function onAddCustomer(){
  //  const result = await app.openModal({
  //   component:ComAddCustomer
  // })

  // if(result){
  //   saleDoc.value.customer =result.name;
  //     await getCustomer(saleDoc.value.customer);
  // }

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