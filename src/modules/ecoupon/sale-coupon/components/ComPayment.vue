<template>
<BaseModal :title="t('Payment')" :hideFooter="false">
    <template #end v-if="plateform=='mobile'">
        <ComSelectPOSReceiptMobile />
    </template>
    
 <ComPaymentAmountInfo class="ion-hide-md-up"/> 
  
   <ion-grid v-if="plateform!=='mobile'">
  <ion-row  >
    <ion-col size="12" size-md="4"   >
      <ComPaymentInput />
    </ion-col>

    <ion-col size="12" size-md="4" class="p-0" >
      
      <ComPaymentSelectPaymentType />
    </ion-col>

    <ion-col size="12" size-md="4" class="p-0" >
      <ComPaymentList />
    </ion-col>
  </ion-row>
</ion-grid>

<div v-else>
  <!-- this payment ui on mobile screen -->
  <ion-grid> 
    <ion-row>
      <ion-col size="12" size-md="4">
        <ComPaymentInput />
      </ion-col>
      <ion-col size="12" size-md="4" class="p-0">
        <ComPaymentSelectPaymentType />
      </ion-col>
      <ion-col size="12" size-md="4" class="p-0">
       
        <ComPaymentList />
      </ion-col>
    </ion-row>
  </ion-grid>
</div>


 
 
     <template #footer>

       <ComPaymentFooter/>
        
    </template>  
</BaseModal>
</template>
<script setup>
import ComPaymentInput from "@/modules/ecoupon/sale-coupon/components/ComPaymentInput.vue"
import ComPaymentSelectPaymentType from "@/modules/ecoupon/sale-coupon/components/ComPaymentSelectPaymentType.vue"
import ComPaymentList from "@/modules/ecoupon/sale-coupon/components/ComPaymentList.vue"
import ComPaymentFooter from "@/modules/ecoupon/sale-coupon/components/ComPaymentFooter.vue"
import ComPaymentAmountInfo from "@/modules/ecoupon/sale-coupon/components/ComPaymentAmountInfo.vue"
import ComSelectPOSReceiptMobile from "@/modules/ecoupon/sale-coupon/components/ComSelectPOSReceiptMobile.vue"
import ComFooterTotalpayment from "@/modules/ecoupon/sale-coupon/components/ComFooterTotalpayment.vue"
import { onMounted, onUnmounted, ref } from "vue"
const t = window.t;
const plateform = ref(app.utils.getPlateform())

onMounted(()=>{
  // disable widnow listender scanner on top up screen
  window.disable_scan_top_up = true;
  
  // disable widnow listender scanner on   redeem scren
  window.disable_scan_redeem = true;
 

})

onUnmounted(()=>{
  //enable widnow listender scanner on top up screen
  window.disable_scan_top_up = false;
  //enable widnow listender scanner on   redeem scren
  window.disable_scan_redeem = false;
 

})

</script>

<style scoped>
.fixed-footer-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* make sure it's above other content */
  background-color: white; /* or match your app background */
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1); /* subtle shadow */
  margin-bottom: 60px;
}





</style>