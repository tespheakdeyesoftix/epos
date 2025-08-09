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
<ComTopUpFooter />
          <ComSummaryInfo />
    </div>
      </ion-page>
</template>
<script setup>
import { ref } from "vue";
import ComSearchBarcode from "@/modules/ecoupon/TopUpList/components/ComSearchBarcode.vue";
import ComTopUpCouponvalue from "@/modules/ecoupon/TopUpList/components/ComTopUpCouponValue.vue";
import ComCouponInformation from "@/modules/ecoupon/TopUpList/components/ComCouponInformation.vue";
import ComTopUpFooter from "@/modules/ecoupon/TopUpList/components/ComTopUpFooter.vue";
import ComSummaryInfo from "@/modules/ecoupon/TopUpList/components/ComSummaryInfo.vue";
const t = window.t
 
</script>