<template>
    <ion-page>
    <ToolBar>
      {{ t("Top Up Coupon") }}
      <template #end>
        <ComUserProfile />
      </template>
    </ToolBar>
    <ion-content>
    <div>
         <ComSearchBarcode />
      <ComCouponInformation />
      <ComTopUpCouponvalue />
    </div>
  
</ion-content>
  <div  >

          <ComSummaryInfo />
          <ComTopUpFooter />
    </div>
      </ion-page>
</template>
<script setup>
import { ref } from "vue";
import { onBeforeRouteLeave } from 'vue-router'
import ComSearchBarcode from "@/modules/ecoupon/TopUpList/components/ComSearchBarcode.vue";
import ComTopUpCouponvalue from "@/modules/ecoupon/TopUpList/components/ComTopUpCouponValue.vue";
import ComCouponInformation from "@/modules/ecoupon/TopUpList/components/ComCouponInformation.vue";
import ComTopUpFooter from "@/modules/ecoupon/TopUpList/components/ComTopUpFooter.vue";
import ComSummaryInfo from "@/modules/ecoupon/TopUpList/components/ComSummaryInfo.vue";
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import {
  onIonViewWillEnter
} from '@ionic/vue';
const t = window.t

 const { saleDoc, saleType, grandTotal, topUpCouponInfo, initSaleDoc, pageRoute,onClearData,topUpSaleProduct,   } = useSaleCoupon();

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