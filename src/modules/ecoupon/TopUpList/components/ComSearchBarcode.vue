<template>
    
 <ion-card>
     <ion-card-title class="pl-2 pt-2">
    <div class="flex align-item-center gap-2">
 <ion-chip color="danger bg-red-500 text-white">1</ion-chip>
 <ion-label class="label-top-up">{{ t('Please scan or enter your coupon code.') }}</ion-label>
  </div>
      </ion-card-title>
    <ion-card-content class="ion-no-margin">
        
<com-input :focus="plateform !='mobile'" 
    :placeholder="t('Scan qr code here')"
    :label="t('Scan qr code here')"
    @onChange="onScanQRCode"
    @onBarcodeChange="onScanQRCode"
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
const { saleDoc,couponCode,inputScanQRCode,topUpCouponInfo } = useSaleCoupon()
const plateform = ref(app.utils.getPlateform())

const t = window.t


 
async function onScanQRCode(valueFromIcon) {
    
    if (valueFromIcon) {
        couponCode.value = valueFromIcon
    }
    
    if (topUpCouponInfo.value && couponCode.value) {
       
        await app.showWarning("Please close the current top up transaction first")
        couponCode.value = ""
        inputScanQRCode.value.focus();
        return
    }

    if(topUpCouponInfo.value){
        return;
    }

    couponCode.value = app.utils.getCouponNumber(couponCode.value);
    if (!couponCode.value) {
        await app.showWarning("Please scan qr code")
        return 
    }

    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.coupon.check_coupon_code_for_top_up", {
        coupon_code: couponCode.value
    })
    if (res.data) {
        topUpCouponInfo.value = res.data
        saleDoc.value.customer = res.data.customer.name
    }
    await l.dismiss()
    couponCode.value = ""
    inputScanQRCode.value.focus();
}

async function onScanWithCamera() {
    const result = await app.utils.onScanBarcode();
    if (result) {
         await onScanQRCode(result)
        
    }

}

onMounted(async ()=>{
    
    if(plateform.value == "mobile"){
     await onScanWithCamera();
    }
})

</script>