<template>
    <BaseModal :title="t('Check Coupon') + '-' + coupon_code">
   
            <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
        <div class="fixed-container"> 
<ComCouponDetail :data="couponDetail" />
        </div>
        
    </BaseModal>
</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
import ComCouponDetail from "@/modules/ecoupon/coupon-codes/components/ComCouponDetail.vue"
import useBarcodeDetector from '@programic/vue-barcode-detector';
const couponID = ref()
const props = defineProps({
    coupon_code: String,
    coupon_id: String
})
const t = window.t;
 
const barcodeDetector = useBarcodeDetector();


const couponDetail = ref()


async function getCouponDetail() {
    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.coupon.get_coupon_detail", {
        coupon_code: couponID.value
    })
    if (res.data) {
        couponDetail.value = res.data;
    }
    await l.dismiss();
}

const onRefreshData = async (event) => {
    await getCouponDetail()
    event.target.complete();
};

function onCheckCouponCode(){
        barcodeDetector.listen(async (barcodeData) => {
    if (barcodeData.value ) {
        
        const res = await app.getDocList("Coupon Codes", {
                    fields: ["name", "coupon"],
                    filters: [["coupon", "=", app.utils.getCouponNumber(barcodeData.value)]],
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

                couponID.value = res.data[0].name;
                 await getCouponDetail();

    }
    });
}
 

onMounted(async () => {
    window.disable_scan_check_coupon = true;
onCheckCouponCode();
    couponID.value = props.coupon_id;
    await getCouponDetail();
})

onUnmounted(() => {
    window.disable_scan_check_coupon = false;
    
barcodeDetector.stopListening();
})

</script>