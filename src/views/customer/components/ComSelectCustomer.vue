<template>
        
  <BaseModal :title="t('Select Customer')">

 
            <DocList docType="Customer" :options="options"> 
                <template   v-slot:default="{ item }">
                    <ComCustomerCard v-for="(d,index) in item" :key="index"  :data="d" @click="onSelectCustomer(d)"/>
                </template>
            </DocList>
        
 </BaseModal>
</template>
<script setup>
import { ref } from 'vue';
import ComCustomerCard from "@/views/customer/components/ComCustomerCard.vue"
 import { modalController } from "@ionic/vue"


const t = window.t
const options = {
   
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name","photo","customer_name_en","phone_number","email_address","customer_group"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[["is_disabled","=",0]],
  hideTopShowingRecord: true
}

function onSelectCustomer(customer){

    modalController.dismiss(customer, 'confirm')
}


</script>