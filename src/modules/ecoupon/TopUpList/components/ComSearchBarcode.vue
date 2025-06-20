<template>
 
    <com-input focus 
    :placeholder="t('Scan qr code here')"
    @change="onScanQRCode"
    ref="inputScanQRCode"
    v-model="couponCode"
    />
 
</template>
<script setup>
import {ref, onMounted}  from "vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
const { couponCode,inputScanQRCode,topUpCouponInfo } = useSaleCoupon()

const t = window.t
async function onScanQRCode(){
   
    if(!couponCode.value){
        await app.showWarning("Please scan qr code")
        return 
    }
    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.coupon.check_coupon_code",{
        coupon_code:couponCode.value
    })
    if(res.data){
        topUpCouponInfo.value =res.data
    }
    await l.dismiss()
    couponCode.value = ""
    inputScanQRCode.value.focus();




}
</script>