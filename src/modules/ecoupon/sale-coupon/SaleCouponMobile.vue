<template>
    <ion-page>
        <ToolBar>{{ t("New Sale") }}</ToolBar>
        <ion-content>
            <ComCustomerCard v-if="saleDoc?.customer"/>
        
            <ComCouponListMobile />
           
             
        </ion-content>
        <ComSaleCouponFooterMobile />
    </ion-page>
</template>
<script setup>
import { onMounted, ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCouponListMobile from "@/modules/ecoupon/sale-coupon/components/ComCouponListMobile.vue"
import ComSaleCouponFooterMobile from "@/modules/ecoupon/sale-coupon/components/ComSaleCouponFooterMobile.vue"
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"


import { useApp } from "@/hooks/useApp";
import { onBeforeRouteLeave } from 'vue-router'
const { saleDoc, initSaleDoc, getSaleDoc, saleType, pageRoute } = useSaleCoupon()
const t = window.t;

onMounted(async ()=>{
  pageRoute.value = "/sale-coupon"
  saleType.value = "Sale Coupon";
  if(app.route.params.name){
    await getSaleDoc()
    
    }else {

      saleDoc.value.sale_type= "Sale Coupon";
    }
})


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
    initSaleDoc()
    next()
  }
})

</script>