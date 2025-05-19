<template>
    <ion-page>
        <AppBar>{{ t("Dashboard") }}</AppBar>
        <ion-content>
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <stack>
             
                <ComDashboardKPI :data="ctrl.kpiData" />
                
                <ComDashboardChart :data="ctrl.chartData" />
                <ComRecentOrder :data="ctrl.recentData" />
            </stack>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import ComRecentOrder from "@/views/dashboard/components/ComRecentOrder.vue"
import ComDashboardChart from "@/views/dashboard/components/ComDashboardChart.vue"
import ComDashboardKPI from "@/views/dashboard/components/ComDashboardKPI.vue"
const t = window.t;
import { useDashboard } from "@/hooks/useDashboard.js"
import { onMounted } from "vue";
const ctrl = useDashboard()


const handleRefresh = async (event: CustomEvent) => {

    await ctrl.getRecentData();
    await ctrl.getChartData();
    await ctrl.getKpiData();
    (event.target as HTMLIonRefresherElement).complete();

};


onMounted(async () => {
    const loading = await app.showLoading()
    await ctrl.getRecentData()
    await ctrl.getKpiData()
    await ctrl.getChartData()
    await loading.dismiss()
})


</script>