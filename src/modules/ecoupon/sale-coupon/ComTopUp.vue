<template>
    <ion-page>
        <ToolBar>
            {{t("Top Up Coupon")}}
        </ToolBar>
        <ion-content>   
  <ComCouponProductList/>
  
        </ion-content>
    </ion-page>
  
</template>
<script setup>
import {ref} from "vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import ComCouponProductList from "@/modules/ecoupon/sale-coupon/components/ComCouponProductList.vue"

const {saleDoc} = useSaleCoupon()
 
const t = window.t

async function onSave(){
    const res = await app.createDoc("Sale",data.value)

    console.log(res)
}

</script>