<template>
<ion-page>
    <AppBar>{{ t("Dashboard") }}</AppBar>
    <ion-content>
        <stack>
            <ComDashboardKPI/>
            <ComDashboardChart/>
           
            <ComRecentOrder :data="ctrl.recentData"/>
        </stack>
    </ion-content>
</ion-page>    
</template>
<script setup>
import ComRecentOrder from "@/views/dashboard/components/ComRecentOrder.vue"
import ComDashboardChart from "@/views/dashboard/components/ComDashboardChart.vue"
import ComDashboardKPI from "@/views/dashboard/components/ComDashboardKPI.vue"
const t = window.t;
import {useDashboard} from "@/hooks/useDashboard.js"
import { onMounted } from "vue";
const ctrl = useDashboard()


onMounted(async ()=>{
    const loading =await app.showLoading()

    await ctrl.getRecentData()
    await loading.dismiss()
})
</script>