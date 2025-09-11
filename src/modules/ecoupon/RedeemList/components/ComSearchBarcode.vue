<template>
    <com-input :placeholder="t('Scan qr code here')" @change="onScanQRCode" v-model="couponCode" :icon="scan" />

 

</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { scan } from "ionicons/icons"
const { couponCode, inputScanQRCode, saleDoc } = useSaleCoupon()
const plateform = ref(app.utils.getPlateform())
const buffer = ref("");
let lastTime = 0;
let disableTextboxInput = false;
const t = window.t
async function onScanQRCode() {

    if (disableTextboxInput == true) return;


    if (!couponCode.value) {
        await app.showWarning("Please scan qr code")
        disableTextboxInput = false;
        return
    }

    couponCode.value = app.utils.getCouponNumber(couponCode.value);

    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.coupon.check_coupon_code_for_redeem", {
        coupon_code: couponCode.value
    })
    if (res.data) {

        // valite sale_products list if coupon code is already selected 
        if (saleDoc.value.sale_products?.flatMap(x => x.coupons).find(x => x.coupon == couponCode.value)) {
            await app.showWarning("This coupon code has been selected.")
            couponCode.value = "";
            disableTextboxInput = false;
            await l.dismiss();
            return;
        }

        const sp = {
            product_code: res.data.product_code,
            product_name: res.data.product_name,
            coupons: [{ name: res.data.coupon_code, coupon: couponCode.value }],
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
    couponCode.value = ""


    disableTextboxInput = false;

}


async function onScanWithCamera() {
    const result = await app.utils.onScanBarcode();
    if (result) {
        couponCode.value = result

        await onScanQRCode()

    }

}


// keyboard listener to hadle scan 
async function onHandleScan(e) {
    if (window.disable_scan_redeem == true) return;
    const now = Date.now();

    // Only track printable keys or Enter
    if (e.key.length === 1 || e.key === "Enter") {
        const timeDiff = now - lastTime;
        lastTime = now;

        // If typing is too slow (>50ms), reset buffer (likely human typing)
        if (timeDiff > 50) {
            buffer.value = "";
        }

        if (e.key === "Enter") {
            if (buffer.value.length > 3) { // prevent noise
                couponCode.value = buffer.value;
                onScanQRCode();
                disableTextboxInput = true;
            }
            buffer.value = "";
        } else {
            buffer.value += e.key;
        }
    }
}


onMounted(async () => {
    window.disable_scan_check_coupon = true;
    window.addEventListener("keydown", onHandleScan);

    if (plateform.value == "mobile") {
        await onScanWithCamera()
    }
})


onUnmounted(() => {
    window.disable_scan_check_coupon = false;
    window.removeEventListener("keydown", onHandleScan);
})

</script>