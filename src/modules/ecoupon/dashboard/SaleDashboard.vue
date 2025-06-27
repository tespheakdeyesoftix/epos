<template>
    <ion-page>
        <AppBar>
            {{ t("Dashbard") }}
        </AppBar>
        <ion-content class="ion-padding">
<ion-refresher slot="fixed" @ionRefresh="handleRefresh">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <ComRevenueKPI :data = "kpiData"/>
            <ion-grid  class="ion-no-margin ion-no-padding">
                <ion-row   >
                    <ion-col  size="8" class="ion-no-padding pr-2">
                             <ComCouponBreakdownChart :data="saleCouponBreakdown"/>
                    </ion-col>
                    <ion-col size="4" >
                        
                            <ComCouponTransactionSummary :data="couponTransactionSummary"/>
                      
                        
                        

                    </ion-col>
                </ion-row>
            </ion-grid>
 
        </ion-content>
    </ion-page>
</template>
<script setup>
const t = window.t ;
import { useDashboard } from "@/hooks/useDashboard";
import ComRevenueKPI from "@/modules/ecoupon/dashboard/components/ComRevenueKPI.vue"
import ComCouponBreakdownChart from "@/modules/ecoupon/dashboard/components/ComCouponBreakdownChart.vue"
import ComCouponTransactionSummary from "@/modules/ecoupon/dashboard/components/ComCouponTransactionSummary.vue"
import { onMounted } from "vue";
const {kpiData,saleCouponBreakdown,getKpiData,getSaleCouponBreakdown,
    couponTransactionSummary,
getCouponTransactionSummary
} = useDashboard()


async function getData(){
  await getKpiData()
  await getSaleCouponBreakdown()
  await getCouponTransactionSummary();
}

const handleRefresh = async (event) => {
    await getData()
    event.target.complete();
};


onMounted(async ()=>{
    const l = await app.showLoading()
   await getData();
    await l.dismiss()
})
</script>