<template>
    <com-input focus 
    :placeholder="t('Scan qr code here')"
    @change="onScanQRCode"
    ref="inputScanQRCode"
    v-model="couponCode"
    :icon="scan"

    />
  
</template>
<script setup>
import {ref, onMounted}  from "vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import { scan } from "ionicons/icons"
const { couponCode,inputScanQRCode,saleDoc } = useSaleCoupon()

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
        console.log((res.data))
        const sp = {
            product_code:res.data.product_code,
            product_name:res.data.product_name,
            coupons:[couponCode.value],
            product_photo:res.data.photo,
            price:2
        } 
        saleDoc.value.sale_products.push(sp)
    }
    await l.dismiss()
    couponCode.value = ""
    inputScanQRCode.value.focus();




}
</script>