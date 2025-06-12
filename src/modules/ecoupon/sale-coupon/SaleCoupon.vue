<template>
    <ion-page>
        <ToolBar>
            {{t("Sale Coupon")}}
        </ToolBar>
        <ion-content>   
  <ComCouponProductList/>
  <ion-button @click="onSave">Save Me</ion-button>
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