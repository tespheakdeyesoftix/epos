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
    
    couponCode.value = app.utils.getCouponNumber(couponCode.value);
      
    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.coupon.check_coupon_code",{
        coupon_code:couponCode.value
    })
    if(res.data){
        
        const sp = {
            product_code:res.data.product_code,
            product_name:res.data.product_name,
            coupons:[{coupon:couponCode.value}],
            product_photo:res.data.photo,
            price:res.data.actual_amount_balance,
            quantity : 1 ,
            coupon_value: res.data.coupon_balance,
            coupon_markup_type : "Percent"

             
        } 
        sp.sub_total = sp.price * sp.quantity
        sp.amount = sp.sub_total
        
        const redeemInfo = res.data;
        delete redeemInfo.product_code
        delete redeemInfo.product_name
        delete redeemInfo.photo
        sp.redeem_coupon_info = redeemInfo

        saleDoc.value.sale_products.push(sp)
    }
    await l.dismiss()
    couponCode.value = ""
    inputScanQRCode.value.focus();




}
</script>