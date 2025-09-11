<template>

  <ion-card button @click="onSelectCustomer">
    <ion-card-content>
      <stack row equal >
       <stack v-if="customer?.name" row >
  <ion-avatar style="width: 50px;height:50px">
  <Img v-if="customer?.photo" :src="customer?.photo"/>
  <div class="avatar-placeholder" v-else>{{ getAvatarLetter(customer?.customer_name_en) }}</div>
</ion-avatar>
<!-- plateform == mobile -->
<div v-if="plateform == 'mobile' || plateform=='tablet'">
  <div class="customerName">
    <div style="width: 100px;">
     {{ customer?.name}} {{ customer?.customer_name_en }} 
    </div>
  </div>
</div>
<!-- plateform != mobile -->
<div v-else>
      {{ customer?.name}} {{ customer?.customer_name_en }}
    <div>
      {{ customer?.phone_number }}
    </div>
    <div>
      {{   customer?.customer_group   }}
    </div>
</div>
</stack>
<div class="select-customer" v-else>
  <span v-if="!customer?.name">{{ t("No Selected") }} </span>
</div>
      
<div class="item-customer-card">
      <ion-button shape="round" fill="clear"  v-tooltip.top="t('Add new customer')" @click.stop="onAddCustomer">
      <ion-icon :icon="addOutline" slot="icon-only"></ion-icon>
      </ion-button>
      <ion-button button color="success" shape="round" fill="clear" v-tooltip.top="t('Scan Member Card')" @click.stop="onScanMemberCard">
      <ion-icon :icon="qrCodeOutline" slot="icon-only"></ion-icon>
      </ion-button>
      <ion-button  v-if="default_customer!=saleDoc.customer" color="danger" shape="round" fill="clear" v-tooltip.left="t('Remove this customer from this order')" @click.stop="onRemoveCustomer">
      <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
      </ion-button>
    </div>
</stack>
 </ion-card-content>
  </ion-card> 
</template>
<script setup>
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { imageUrl, getAvatarLetter } from "@/helpers/utils" 
import { addOutline, closeOutline, qrCodeOutline } from "ionicons/icons";
import { onMounted,ref } from "vue";
import ComAddCustomer from "@/views/customer/components/ComAddCustomer.vue"
const t = window.t;
const plateform = ref(app.utils.getPlateform());
const { saleDoc,customer } = useSaleCoupon()
const default_customer=  ref(app.setting.pos_profile.default_customer)

async function onSelectCustomer(){
    const result = await app.utils.onSelectCustomer();
    if(result){
      saleDoc.value.customer = result.name;
      await getCustomer(result.name)
    }
}
async function onScanMemberCard(){
    const result = await app.utils.onScanMemberCard();
    if(result){
       saleDoc.value.customer = result
      await getCustomer(result)   
    
    }
}
async function onAddCustomer(){
    const result = await app.utils.onAddCustomer();
    if(result){
       saleDoc.value.customer = result.name
        customer.value = result
    }
}
async function getCustomer(name){
  const res = await app.getDoc("Customer",name);
  if(res.data){
    customer.value = res.data
  }
}

async function onRemoveCustomer() {
   
  saleDoc.value.customer = app.setting.pos_profile.default_customer
  getCustomer(saleDoc.value.customer);
  await app.showSuccess("Customer has been remove from order")
}

onMounted(()=>{
getCustomer(saleDoc.value.customer);
});
</script>
