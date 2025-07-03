<template>
    <ion-page>
        <AppBar v-if="showAppBar ">
         {{ t("Coupon Detail") }}
         <template #end>
        <ion-button @click="onReloadData" shape="round">
             <ion-icon :icon="refreshOutline" slot="icon-only"/>
        </ion-button>
         
         </template>
        </AppBar>
        <ToolBar v-else>
         {{ t("Coupon Detail") }} - {{ data?.coupon_info.coupon }}
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
                    <ComCouponDetail :data="data"/>
                     </div>
        </ion-content>
        <ComFooter>
            <ion-button>{{ t("Edit") }}</ion-button>
            <ion-button color="danger" @click="onDelete">{{ t("Delete") }}</ion-button>
        </ComFooter>
    </ion-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import ComCouponDetail from "@/modules/ecoupon/coupon-codes/components/ComCouponDetail.vue"
import { refreshOutline } from 'ionicons/icons';


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

async function onDelete(){
    
 
    const confirm = await app.utils.onConfirm("Delete Coupon","Are you sure you want to delete this coupon code?")
    if (!confirm) return;
    const l = await app.showLoading()
    
    const res = await app.deleteDoc("Coupon Codes", app.route.params.name);
    if(res.data){
        window.refresh_page = 1;
        
        app.ionRouter.navigate("/coupon-code-list","back","replace")
    }
    await l.dismiss()
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
<style scoped>
ion-list,ion-item{
     --background: transparent; 
     background: transparent !important;
}
</style>