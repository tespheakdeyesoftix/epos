<template>
    <BaseModal :title="t('Check Coupon') + '-' + coupon_code">
        <div class="fixed-container"> 
<ComCouponDetail :data="couponDetail" />
        </div>
        
    </BaseModal>
</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
import ComCouponDetail from "@/modules/ecoupon/coupon-codes/components/ComCouponDetail.vue"
const props = defineProps({
    coupon_code: String,
    coupon_id: String
})
const t = window.t;
const buffer = ref("");
let lastTime = 0;
const couponDetail = ref()


async function getCouponDetail(coupon_code) {
    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.coupon.get_coupon_detail", {
        coupon_code: coupon_code
    })
    if (res.data) {
        couponDetail.value = res.data;
    }
    await l.dismiss();
}


  async function onHandleScan(e) {
 
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
                
                const res = await app.getDocList("Coupon Codes", {
                    fields: ["name", "coupon"],
                    filters: [["coupon", "=", app.utils.getCouponNumber(buffer.value)]],
                    orderBy: {
                        field: 'creation',
                        order: 'desc',
                    },
                    limit: 1
                });
                if (res.data.length == 0) {
                    await app.showWarning(t("No coupon code found"));
                    return;
                }
                  getCouponDetail(res.data[0].name)
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
    await getCouponDetail(props.coupon_id);
})

onUnmounted(() => {
    window.disable_scan_check_coupon = false;
    window.removeEventListener("keydown", onHandleScan);
})

</script>