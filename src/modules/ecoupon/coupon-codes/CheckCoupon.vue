<template>
    <ion-page>
        <AppBar v-if="showAppBar">
            {{ t("Check Coupon Code") }}
            <template #end>
                <ion-button @click="onReloadData" shape="round" class="ion-hide-sm-down">
                    <ion-icon :icon="refreshOutline" slot="icon-only" />
                </ion-button>
            </template>
            <template #search>
                 <ion-searchbar
      :search-icon="qrCode"
        :placeholder="t('Check coupon code')"
        style="max-width: 300px;"
        @ionChange="onCheckCouponCode"
        class="ion-hide-sm-down search_bar"
        v-model="keyword"
        ref="txtSearchRef"
        
      ></ion-searchbar>
            </template>

        </AppBar>
        <ToolBar v-else>
            {{ t("Coupon Detail") }}
            <template #end>
                <ion-button @click="onReloadData" shape="round" class="ion-hide-sm-down">
                    <ion-icon :icon="refreshOutline" slot="icon-only" />
                </ion-button>
            </template>
        </ToolBar>
        <ion-content>
         
            <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <div class="fix-container">

                <template v-if="data?.length > 0">
                    <ComCouponDetail v-if="data?.length == 1" :data="couponDetail"></ComCouponDetail>
                    <ComCouponCodeList :data="data" v-else />
                </template>
                <template v-else>
                    <div v-if="!isLoading">
                        No Coupon Code Found
                    </div>

                </template>
            </div>
        </ion-content>

    </ion-page>
</template>
<script setup>
import ComCouponCodeList from "@/modules/ecoupon/coupon-codes/components/ComCouponCodeList.vue"
import ComCouponDetail from "@/modules/ecoupon/coupon-codes/components/ComCouponDetail.vue"
import { qrCode, refreshOutline } from "ionicons/icons";
import { onMounted, ref } from 'vue';
const isLoading = ref(true)
const t = window.t;
const showAppBar = ref(app.route.query.appbar == 1)
const data = ref()
const couponDetail = ref()
const coupon_code = ref("")
const keyword=ref("")
const txtSearchRef = ref(null)
async function getData() {
     
    const res = await app.getDocList("Coupon Codes", {
        fields: ["*"],
        limit: 1000,
        filters: [["coupon", "=", coupon_code.value]],
        orderBy: {
            field: "creation",
            order: "asc",
        },
    })
    if (res.data) {
        data.value = res.data
        if (res.data.length == 1) {
            await getCouponDetail(res.data[0].name);
        }
    }
    isLoading.value = false;
  
}

 
async function getCouponDetail(couponCode) {
    const res = await app.getApi("epos_restaurant_2023.api.coupon.get_coupon_detail", {
        coupon_code: couponCode
    })
    if (res.data) {
        couponDetail.value = res.data;
    }
}
const onRefreshData = async (event) => {
    await getData();
    event.target.complete();

};
async function onReloadData() {
    const l = await app.showLoading()
    await getData()
    await l.dismiss()

}


async function onCheckCouponCode(){
  if(keyword.value){
      const res = await app.getDocList("Coupon Codes", {
        filters: [["coupon", "=", app.utils.getCouponNumber(keyword.value)]],
        limit: 1
      });
      if(res.data){

     
      if(res.data.length == 0){
        await app.showWarning(t("No coupon code found"));
 txtSearchRef.value?.$el?.setFocus()
        const nativeInput = txtSearchRef.value?.$el?.querySelector('input')
    nativeInput?.select()
        return;

        
      }else {
        
        coupon_code.value =app.utils.getCouponNumber(keyword.value)
        window.history.replaceState({}, '', `/#/check-coupon/${ coupon_code.value}&appbar=${app.route.query.appbar}`);
        const l = await app.showLoading()
        await getData()
        await l.dismiss()
           txtSearchRef.value?.$el?.setFocus()
      }
      
    }
      
  }
  keyword.value = ""
}


onMounted(async () => {

    coupon_code.value = app.route.params.name
     const l = await app.showLoading()
    await getData()
    await l.dismiss()
})
</script><style scoped>
.search_bar{
  position: absolute;
max-width: 300px;
top: 0;
left: 50%;
transform: translateX(-50%);
}
</style>
  
