<template>
    <ion-page>
        <ToolBar>
            {{ t("Sale Coupon") }}
            <template #end>
              <ComUserProfile />
            </template>
        </ToolBar>
        <ion-content>
            <ion-grid class="h-100">
                <ion-row class="h-100">
                    <ion-col :size="plateform == 'mobile' ? 12:8" >
                        <ComCouponProductList />
                    </ion-col>
                    <ion-col class="bg-order-card" :size="plateform == 'mobile' ? 12:4">
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
    import ComUserProfile from "@/views/layouts/ComUserProfile.vue"  
  
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
<style scoped>
.h-100{
  height: 100%;
}
.bg-order-card{
  background-color: var(--ion-color-light-tint);
}
</style>