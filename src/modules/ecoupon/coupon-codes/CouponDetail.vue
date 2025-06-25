<template>
    <ion-page>
        <AppBar v-if="showAppBar ">
         {{ t("Coupon Detail") }}
        </AppBar>
        <ToolBar v-else>
         {{ t("Coupon Detail") }} - {{ data?.coupon_info.coupon }}
        </ToolBar>
        <ion-content>
                <div class="fix-container">
                    <ComCouponDetail :data="data"/>
                     </div>
        </ion-content>
        <ComFooter>
            <ion-button>{{ t("Edit") }}</ion-button>
            <ion-button color="danger">{{ t("Delete") }}</ion-button>
        </ComFooter>
    </ion-page>
</template>
<script setup>

import { onMounted, ref } from 'vue';
import ComCouponDetail from "@/modules/ecoupon/coupon-codes/components/ComCouponDetail.vue"
const t = window.t;
const showAppBar = ref(app.route.query.appbar==1)
const data = ref()
async function getData(){
    const l = await app.showLoading();
    const res = await app.getApi("epos_restaurant_2023.api.coupon.get_coupon_detail",{
        coupon_code:app.route.params.name
    })
    if (res.data){
        data.value= res.data
    }

    await l.dismiss();
}
onMounted(async ()=>{
await getData();
})
</script>
<style scoped>
ion-list,ion-item{
     --background: transparent; 
     background: transparent !important;
}
</style>