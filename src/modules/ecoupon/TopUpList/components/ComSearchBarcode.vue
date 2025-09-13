<template>

  <ion-card>
    <ion-card-title class="pl-2 pt-2">
      <div class="flex align-item-center gap-2">
        <ion-chip color="danger bg-red-500 text-white">1</ion-chip>
        <ion-label class="label-top-up">{{ t('Please scan or enter your coupon code.') }}</ion-label>
      </div>
    </ion-card-title>
    <ion-card-content class="ion-no-margin">

      <com-input :placeholder="t('Scan qr code here')" :label="t('Scan qr code here')" @onChange="onScanQRCode"
        @onBarcodeChange="onScanQRCode" ref="inputScanQRCode" v-model="couponCode" :icon="scan" />
    </ion-card-content>
  </ion-card>

</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { scan } from "ionicons/icons"
import useBarcodeDetector from '@programic/vue-barcode-detector';
const { saleDoc, couponCode, inputScanQRCode, topUpCouponInfo } = useSaleCoupon()
const plateform = ref(app.utils.getPlateform())
const bacodeDetector = useBarcodeDetector();
const t = window.t
let disableTextboxInput = false;
const buffer = ref("");
let lastTime = 0;


async function onScanQRCode(valueFromIcon) {

  // we validate this to stop process code when use scan barcode using keydown event listender
  // this event raise when use manually enter qr code in txt scan qr code only
  if (disableTextboxInput == true) return;

  if (valueFromIcon) {
    couponCode.value = valueFromIcon
  }

  if (topUpCouponInfo.value && couponCode.value) {

    await app.showWarning("Please close the current top up transaction first")

    couponCode.value = ""
    inputScanQRCode.value.focus();
    disableTextboxInput = false;
    return
  }

  if (topUpCouponInfo.value) {
    disableTextboxInput = false;
    return;
  }

  couponCode.value = app.utils.getCouponNumber(couponCode.value);
  if (!couponCode.value) {
    await app.showWarning("Please scan qr code")
    disableTextboxInput = false;
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
  disableTextboxInput = false;
}

async function onScanWithCamera() {
  const result = await app.utils.onScanBarcode();
  if (result) {
    await onScanQRCode(result)

  }

}
 



onMounted(async () => {
  window.disable_scan_check_coupon = true;
  bacodeDetector.listen((barcode)=>{
    if(window.disable_scan_top_up) return;
    onScanQRCode(barcode.value)
  })

  if (app.utils.isMobile()) {
    let setting = await app.storageService.getItem("userPreference")
 
    if (setting) {
      setting = JSON.parse(setting);
      if (setting.open_camera_on_top_up) {
        await onScanWithCamera();
      }

    }

  }
})

onUnmounted(() => {
  window.disable_scan_check_coupon = false;
  bacodeDetector.stopListening();
})

</script>