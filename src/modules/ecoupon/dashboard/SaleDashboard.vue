<template>
    <ion-page>
        <AppBar>
            {{ t("Dashboard") }}
             <template #end>
                <ion-button @click="onReloadData" shape="round" class="ion-hide-sm-down">
                    <ion-icon :icon="refreshOutline" slot="icon-only" />
                </ion-button>
            </template>
        </AppBar>
        <ion-content class="ion-padding">
<ion-refresher slot="fixed" @ionRefresh="handleRefresh">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <ComRevenueKPI :data = "kpiData"/>
            <ion-grid  class="ion-no-margin ion-no-padding">
                <ion-row   >
                    <ion-col  size="12"  size-xs="12"   size-md="8"   class="ion-no-padding pr-2">
                             <ComCouponBreakdownChart :data="saleCouponBreakdown"/>
                    </ion-col>
                    <ion-col  size="12" size-xs="12"  size-md="4" >
                        
                            <ComCouponTransactionSummary :data="couponTransactionSummary"/>
                      
                        
                        

                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                       <ComDailySaleChart :data="chartData"/>
                    </ion-col>
                </ion-row>
                <ion-row class="mt-3">
                    <ion-col size="12"  size-xs="12" size-sm="12"  size-md="6"   class="pr-2">
                        <ComCouponUseByPOSStationChart :data="couponUsedSummaryByPOSStation"/>
                    </ion-col>
                    <ion-col size="12"  size-xs="12" size-sm="12"   size-md="6"    class="pl-2"> 
                         <ComPaymentBreakDown :data="paymentbreakdown"/></ion-col>
                </ion-row>
                
                    <ion-row class="mt-3">
<ion-col>
    <ComRecentData />
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
import ComDailySaleChart from "@/modules/ecoupon/dashboard/components/ComDailySaleChart.vue"
import ComPaymentBreakDown from "@/views/dashboard/components/ComPaymentBreakDown.vue"
import ComCouponUseByPOSStationChart from "@/modules/ecoupon/dashboard/components/ComCouponUseByPOSStationChart.vue"
import ComRecentData from "@/modules/ecoupon/dashboard/components/ComRecentData.vue"
import { onMounted } from "vue";
import { refreshOutline } from "ionicons/icons";
const {
        kpiData,
        saleCouponBreakdown,
        paymentbreakdown,
        couponTransactionSummary,
        chartData,
        couponUsedSummaryByPOSStation,
        getKpiData,
        getSaleCouponBreakdown,
        getCouponTransactionSummary,
        getChartData,
        getPaymentBreakDown,
        getCouponUseSummaryByPOSStation
    } = useDashboard()


async function getData(){
  await getKpiData();
  await getSaleCouponBreakdown();
  await getCouponTransactionSummary();
  await getChartData();
//   to disable loading 
  getPaymentBreakDown();
  getCouponUseSummaryByPOSStation();
}

const handleRefresh = async (event) => {
    await getData()
    event.target.complete();
};

async function onReloadData() {
    const l = await app.showLoading()
    await getData()
    await l.dismiss()

}



onMounted(async ()=>{
    const l = await app.showLoading()
   await getData();
    await l.dismiss()
})
</script>