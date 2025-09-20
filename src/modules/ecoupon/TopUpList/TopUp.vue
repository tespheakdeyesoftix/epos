<template>
  <ion-page>
    <ToolBar>
      {{ t("Top Up Coupon") }}
      <template #end>
        <ComUserProfile />
      </template>
    </ToolBar>
    <ion-content>
      <!-- desktop ui -->
        <ion-split-pane when="xs" content-id="main"
        
        v-if="!isMobileUI"
        >
    <ion-menu content-id="main">
      <ion-content class="ion-padding">   
       
      <ComSearchBarcode />
      <ComTopUpCouponValue />
      </ion-content>
        <ComTopUpFooter />
    </ion-menu>
    <div class="ion-page" id="main">
      <ion-content class="ion-padding">
            <ComCouponInformation />
               <div class="fix-container px-2 mt-4 ">
        <com-input v-model="saleDoc.note" type="text-area" :label="t('Note')" :placeholder="t('Top Up Note')"
          storageKey="top_up_note" />
      </div>
           
      
      </ion-content>
     <ComPaymentButton/>
    </div> 
    
  </ion-split-pane>
     
  <!-- ====================MOBILE UI==================-->
  <div v-else>
         <ComSearchBarcode />
      <ComCouponInformation />
      <ComTopUpCouponValue />
      <div class="fix-container px-2 mt-1 mb-2">
        <com-input v-model="saleDoc.note" type="text-area" :label="t('Note')" :placeholder="t('Top Up Note')"
          storageKey="top_up_note" />
      </div>
    </div>

  
    </ion-content>
<!-- ====================MOBILE Footer==================-->
    <template v-if="isMobileUI">
       <ComSummaryInfo />
          <ComTopUpFooter />
    </template>
  
  </ion-page>

</template>

<script setup>
import { ref, onMounted } from "vue"
import ComSearchBarcode from "@/modules/ecoupon/TopUpList/components/ComSearchBarcode.vue";
import ComCouponInformation from "@/modules/ecoupon/TopUpList/components/ComCouponInformation.vue";
import ComTopUpCouponValue from "@/modules/ecoupon/TopUpList/components/ComTopUpCouponvalue.vue";
import ComSummaryInfo from "@/modules/ecoupon/TopUpList/components/ComSummaryInfo.vue";
import ComTopUpFooter from "@/modules/ecoupon/TopUpList/components/ComTopUpFooter.vue";
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import {
  onIonViewWillEnter
} from '@ionic/vue';
import { onBeforeRouteLeave } from 'vue-router'
import ComPaymentButton from "../sale-coupon/components/ComPaymentButton.vue";
const { saleDoc, saleType, grandTotal, topUpCouponInfo, initSaleDoc, pageRoute,onClearData,topUpSaleProduct  } = useSaleCoupon();
const isMobileUI = ref(window.innerWidth <= 900)
 

const t = window.t;
 
function handleUpdateScreenMode() {
  isMobileUI.value = (window.innerWidth <= 900);
}

onMounted(async () => {
   initSaleDoc()
})

onIonViewWillEnter(()=>{
  window.disable_scan_check_coupon = true;
  window.addEventListener("resize", handleUpdateScreenMode);
  if(!app.route.params.name){
  saleType.value = "Top Up"
  
  pageRoute.value = "top-up"
    onClearData()
      saleDoc.value.sale_type = "Top Up";
  } 
 
})


onBeforeRouteLeave(async (to, from, next) => {
  window.disable_scan_check_coupon = false;
  window.removeEventListener("resize", handleUpdateScreenMode);

  if (topUpCouponInfo.value) {
    const confirm = await app.onConfirm("Confirm", "You have pending top up coupon. Do you want to continue?")
    if (!confirm) {
      next(false)
    } else {
      
      initSaleDoc()
      topUpCouponInfo.value = null;
      topUpSaleProduct.value = null
      next()
    }
  } else {
     initSaleDoc()
      topUpCouponInfo.value = null;
      topUpSaleProduct.value = null
    next()
  }

  

})


</script>
<style scoped>
.bg-order-card{
  background-color: var(--ion-color-light-tint);
}
ion-split-pane {
    --side-width: 60%;
    --side-max-width: 60%;
    --border: 1px dashed #b3baff;
}


</style>