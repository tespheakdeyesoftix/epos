<template>
 
    <com-input forcus 
    :placeholder="t('Scan qr code here')"
    @change="onScanQRCode"
    ref="inputRef"
    v-model="couponCode"
    />
 
</template>
<script setup>
import {ref, onMounted}  from "vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const { couponCode,topUpCouponInfo} = useSaleCoupon()
const inputRef= ref(null)
const t = window.t
async function onScanQRCode(){
   
    if(!couponCode.value){
        await app.showWarning("Please scan qr code")
        return 
    }

    const res = await app.getApi("epos_restaurant_2023.api.coupon.check_coupon_code",{
        coupon_code:couponCode.value
    })
    if(res.data){
        topUpCouponInfo.value =res.data
    }


    couponCode.value = ""

}
</script>