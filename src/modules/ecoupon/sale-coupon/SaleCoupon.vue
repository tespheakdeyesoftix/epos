<template>
    <ion-page>
        <ToolBar>
            {{ t("Sale Coupon") }}
        </ToolBar>
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col :size="plateform == 'mobile' ? 12:8" >
                        <ComCouponProductList />
                    </ion-col>
                    <ion-col style="text-align: center;" :size="plateform == 'mobile' ? 12:4">
                        <ComCustomerCard v-if="saleDoc?.customer"/>
                        <ComSaleProductCoupon />
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
       <ComSaleCouponFooter/>
    </ion-page>

</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import ComCouponProductList from "@/modules/ecoupon/sale-coupon/components/ComCouponProductList.vue"
import ComSaleProductCoupon from "@/modules/ecoupon/sale-coupon/components/ComSaleProductCoupon.vue"
import ComCustomerCard from "@/modules/ecoupon/sale-coupon/components/ComCustomerCard.vue"
import ComSaleCouponFooter from "@/modules/ecoupon/sale-coupon/components/ComSaleCouponFooter.vue"
import { onBeforeRouteLeave } from 'vue-router'
const plateform = ref(app.utils.getPlateform())
const { saleDoc,initSaleDoc,getSaleDoc } = useSaleCoupon()


const t = window.t
 

onMounted(async ()=>{
  if(app.route.params.name){
    await getSaleDoc()
    }else {
      initSaleDoc();
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
    next()
  }
})
</script>