<template>
 <ion-card>
    <ion-card-content class="ion-no-margin">
        <ion-label class="flex justify-item-center gap-2">
            <ion-badge class="px-3" color="danger">
                <h2>1</h2>
            </ion-badge>
            <ion-text class="ms-2">
                <h2>
                    <b> {{ t('Please Inter Or Scan Coupon') }}   </b>
                </h2>
            </ion-text>
        </ion-label>
        <com-input focus 
    :placeholder="t('Scan qr code here')"
    @change="onScanQRCode"
    ref="inputScanQRCode"
    v-model="couponCode"
    :icon="scan"
    />
    </ion-card-content>
 </ion-card>
   
 
</template>
<script setup>
import {ref, onMounted}  from "vue"
import {useSaleCoupon} from "@/hooks/useSaleCoupon.js"
import { scan } from "ionicons/icons"
const { couponCode,inputScanQRCode,topUpCouponInfo } = useSaleCoupon()

const t = window.t
async function onScanQRCode(){
     couponCode.value = app.utils.getCouponNumber(couponCode.value);
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