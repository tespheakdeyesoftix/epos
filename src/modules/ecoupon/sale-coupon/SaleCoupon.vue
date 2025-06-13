<template>
    <ion-page>
        <ToolBar>
            {{ t("Sale Coupon") }}
        </ToolBar>
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col size="8">
                        <ComCouponProductList />
                    </ion-col>
                    <ion-col size="4">
                        <ComCustomerCard />
                        <ComSaleProductCoupon />
                    </ion-col>
                </ion-row>
            </ion-grid>

            <ion-button @click="onSave">Save Me</ion-button>
        </ion-content>
       <ComSaleCouponFooter/>
    </ion-page>

</template>
<script setup>
import { onUnmounted, ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCouponProductList from "@/modules/ecoupon/sale-coupon/components/ComCouponProductList.vue"
import ComSaleProductCoupon from "@/modules/ecoupon/sale-coupon/components/ComSaleProductCoupon.vue"
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"
import ComSaleCouponFooter from "@/modules/ecoupon/sale-coupon/components/ComSaleCouponFooter.vue"
import {  onIonViewWillLeave } from '@ionic/vue';
import { onBeforeRouteLeave } from 'vue-router'
const { saleDoc,initSaleDoc } = useSaleCoupon()
saleDoc.value.sale_type= "Sale Coupon";

const t = window.t
 

onBeforeRouteLeave(async (to, from, next) => {
  if (saleDoc.value.sale_products.length > 0) {
    const confirm = await app.onConfirm("Confirm", "You have pending order. Do you want to continue?")
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