<template>
    <ion-page>
        <AppBar v-if="showAppBar ">
         {{ t("Check Coupon Code") }}
         <template #end>
 <ion-button @click="onReloadData" shape="round">
             <ion-icon :icon="refreshOutline" slot="icon-only"/>
        </ion-button>
         </template>
         
        </AppBar>
        <ToolBar v-else>
         {{ t("Coupon Detail") }}
             <template #end>
 <ion-button @click="onReloadData" shape="round">
             <ion-icon :icon="refreshOutline" slot="icon-only"/>
        </ion-button>
         </template>
        </ToolBar>
        <ion-content>
            <ion-refresher slot="fixed" @ionRefresh="onRefreshData">
        <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
            <div class="fix-container">
               
             <template v-if="data?.length>0">
 <ComCouponDetail v-if="data?.length==1" :data="couponDetail"></ComCouponDetail>
              <ComCouponCodeList   :data="data" v-else  /> 
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
import { onMounted, ref } from 'vue';
const isLoading = ref(true)
const t = window.t;
const showAppBar = ref(app.route.query.appbar==1)
const data = ref()
const couponDetail = ref()
async function getData(){
    const l = await app.showLoading();
    const res = await app.getDocList("Coupon Codes",{
        fields:["*"],
        limit:1000,
        filters:[["coupon","=",app.route.params.name]],
        orderBy:{
      field: "creation",
      order: "asc",
  },
    })
    if (res.data){
        data.value= res.data
        if(res.data.length==1){   
            await getCouponDetail(res.data[0].name);
        }
    }
    isLoading.value = false;
    await l.dismiss();
}

async function getCouponDetail(couponCode){
    const res =await app.getApi("epos_restaurant_2023.api.coupon.get_coupon_detail",{
        coupon_code:couponCode
    })
    if(res.data){
        couponDetail.value = res.data;
    }
}
const onRefreshData = async (event) => {
   await getData();
    event.target.complete();
  
};
async function onReloadData(){
    const l = await app.showLoading()
    await getData()
    await l.dismiss()
    
}


onMounted(async ()=>{
await getData();
})
</script>
