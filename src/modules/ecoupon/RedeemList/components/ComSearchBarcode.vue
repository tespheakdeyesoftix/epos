<template>

    <com-input :placeholder="t('Scan qr code here')" 
    @change="onScanCouponCode" v-model="couponCode" 
    :icon="scan" />
 
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { scan } from "ionicons/icons"
import useBarcodeDetector from '@programic/vue-barcode-detector';
const { couponCode, inputScanQRCode, saleDoc } = useSaleCoupon()

const t = window.t
const barcodeDetector =useBarcodeDetector();
 
async function onScanCouponCode(){
 
    await checkCouponCode(couponCode.value);
    
    couponCode.value = ""    
     
}


 
 

async function checkCouponCode(coupon_code) {
 
    if (!coupon_code) {
        await app.showWarning("Please scan qr code")
       
        return
    }

    

    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.coupon.check_coupon_code_for_redeem", {
        coupon_code: app.utils.getCouponNumber(coupon_code)
    })
    if (res.data) {
        
        // valite sale_products list if coupon code is already selected 
        if (saleDoc.value.sale_products?.flatMap(x => x.coupons).find(x => x.coupon ==  app.utils.getCouponNumber(coupon_code))) {
            await app.showWarning("This coupon code has been selected.")
   
            await l.dismiss();
            return;
        }

        const sp = {
            product_code: res.data.product_code,
            product_name: res.data.product_name,
            coupons: [{ name: res.data.coupon_code, coupon:  app.utils.getCouponNumber(coupon_code) }],
            product_photo: res.data.photo,
            price: res.data.actual_amount_balance,
            quantity: 1,
            coupon_value: res.data.coupon_balance,
            coupon_markup_type: "Percent"


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
  
  

}


async function onScanWithCamera() {
    const result = await app.utils.onScanBarcode();
    if (result) {
         

        await checkCouponCode(result)

    }

}

 

onMounted(async () => {
    window.disable_scan_check_coupon = true;
    barcodeDetector.listen((barcode)=>{
        if (window.disable_scan_redeem) return;
        if(!couponCode.value){
             
checkCouponCode(barcode.value);
        }
            
    })

    
  if (app.utils.isMobile()) {
    let setting = await app.storageService.getItem("userPreference")
    if (setting) {
      setting = JSON.parse(setting);
      if (setting.open_camera_on_redeem) {
        await onScanWithCamera();
      }

    }

  }
})


onUnmounted(() => {
    window.disable_scan_check_coupon = false;
    barcodeDetector.stopListening();
    couponCode.value = ""

})



</script>