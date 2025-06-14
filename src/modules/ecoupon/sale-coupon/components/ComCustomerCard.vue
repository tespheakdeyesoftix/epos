<template>
   
  <ion-card button @click="onSelectCustomer">
    {{ customer?.photo }}
     {{ customer?.name }} - {{ customer?.customer_name_en }} {{ customer?.phone_number }}
     {{   customer?.customer_group   }}

     <ion-button shape="round" fill="clear">
      <ion-icon :icon="searchOutline" slot="icon-only"></ion-icon>
     </ion-button>
     
     <ion-button button color="success" shape="round" fill="clear" v-tooltip.top="t('Scan Member Card')" @click="onScanMemberCard">
      <ion-icon :icon="qrCodeOutline" slot="icon-only"></ion-icon>
     </ion-button>
     
     <ion-button  color="danger" shape="round" fill="clear" v-tooltip.top="t('Remove this customer from this order')" @click.stop="onRemoveCustomer">
      <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
     </ion-button>


     
  </ion-card> 
  
   
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { closeOutline, qrCodeOutline, searchOutline } from "ionicons/icons";
import { onMounted,ref } from "vue";
const t = window.t;
const { saleDoc,customer } = useSaleCoupon()


async function onSelectCustomer(){
    const result = await app.utils.onSelectCustomer();
    if(result){
      saleDoc.value.customer = result.name;
      await getCustomer(result.name)
    }
}
async function onScanMemberCard(){
    const results = await app.utils.onScanMemberCard();
    if(results){
       
     alert(results)
    }
}
async function getCustomer(name){
  const res = await app.getDoc("Customer",name);
  if(res.data){
    customer.value = res.data
  }
}

async function onRemoveCustomer() {
  
    if(app.setting.pos_profile.default_customer != saleDoc.value.customer){
      saleDoc.value.customer = app.setting.pos_profile.default_customer;
      await getCustomer(saleDoc.value.customer);
      await app.showSuccess("Customer has been remove from order")
    }
}
onMounted(()=>{
getCustomer(saleDoc.value.customer);
})
</script>