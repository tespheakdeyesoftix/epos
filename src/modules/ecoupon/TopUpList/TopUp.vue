<template>
    <ion-page>
        <ToolBar>
            {{ t("Top Up Coupon") }} 
            <template #end>
              <ComUserProfile />
            </template>
        </ToolBar>
        <ion-content>
            <div class="fix-container">
                <ComSearchBarcode/>
                <ComCouponInformation/>
                <ComTopUpCouponvalue/>
 <ComSummaryInfo/>

           

            <com-input v-model="saleDoc.note" type="text-area"  :label="t('Note')" :placeholder="t('Top Up Note')" 
                storageKey="sale_note"
            />
             </div>
        </ion-content>
        <ComTopUpFooter />
</ion-page>

</template>

<script setup>
import {ref,onMounted} from "vue"
import ComSearchBarcode from "@/modules/ecoupon/TopUpList/components/ComSearchBarcode.vue";
import ComCouponInformation from "@/modules/ecoupon/TopUpList/components/ComCouponInformation.vue";
import ComTopUpCouponvalue from "@/modules/ecoupon/TopUpList/components/ComTopUpCouponvalue.vue";
import ComSummaryInfo from "@/modules/ecoupon/TopUpList/components/ComSummaryInfo.vue";
import ComTopUpFooter from "@/modules/ecoupon/TopUpList/components/ComTopUpFooter.vue";
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const {saleDoc,saleType,grandTotal,topUpCouponInfo,initSaleDoc } = useSaleCoupon();
  
import { onBeforeRouteLeave } from 'vue-router'
const t = window.t;

onMounted(()=>{
saleType.value = "Top Up"
    saleDoc.value.sale_type= "Top Up";

})


onBeforeRouteLeave(async (to, from, next) => {
  if (topUpCouponInfo.value) {
    const confirm = await app.onConfirm("Confirm", "You have pending top up coupon. Do you want to continue?")
    if (!confirm) {
      next(false)  
    } else {   
      initSaleDoc()
next()
    }
  } else {
    next()
  }
})


</script>