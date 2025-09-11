<template>
  <ion-page>
    <ToolBar>
      {{ t("Top Up Coupon") }}
      <template #end>
        <ComUserProfile />
      </template>
    </ToolBar>
    <ion-content>
        <ion-split-pane when="xs" content-id="main">
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
          
               <div class="fix-container px-2 mt-1">
        <com-input v-model="saleDoc.note" type="text-area" :label="t('Note')" :placeholder="t('Top Up Note')"
          storageKey="top_up_note" />
      </div>
           
      
      </ion-content>
     <ComSummaryInfo />
    </div> 
    
  </ion-split-pane>
     
    </ion-content>
  
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
const { saleDoc, saleType, grandTotal, topUpCouponInfo, initSaleDoc, pageRoute,onClearData,topUpSaleProduct  } = useSaleCoupon();


const t = window.t;
function test(){
  onClearData()
}
onMounted(() => {
  
})

onIonViewWillEnter(()=>{
  if(!app.route.params.name){
  saleType.value = "Top Up"
  pageRoute.value = "top-up"
    onClearData()
      saleDoc.value.sale_type = "Top Up";
  }
  

})


onBeforeRouteLeave(async (to, from, next) => {
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