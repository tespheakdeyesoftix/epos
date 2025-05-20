<template>
    <ion-page>
        <AppBar>{{ t("Dashboard") }}</AppBar>
        <ion-content > 
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <ComSelect docType="POS Profile"  :filters="[['is_edoor_profile','=',0]]" multiple v-model="selectedPOSProfiles" @onSelected="onSelectOutlet">
                <ion-item :button="true"> 
                <ion-icon color="danger" slot="start" :icon="storefrontOutline" size="large"></ion-icon>
                <ion-label>{{ selectProfile }}</ion-label>
               
                    <ion-button shape="round" size="small" slot="end" style="--background: #3D8D7A;" >{{
                    t("Select POS Profile")
                }}</ion-button>
            </ion-item>
        </ComSelect>
            <stack class="ion-padding">
                <ComDashboardKPI :data="ctrl.kpiData" />
                <ComDashboardChart :data="ctrl.chartData" />
                <ComRecentOrder :data="ctrl.recentData" />
            </stack>
        </ion-content>
    </ion-page>
</template>
<script setup >

import ComRecentOrder from "@/views/dashboard/components/ComRecentOrder.vue"
import ComDashboardChart from "@/views/dashboard/components/ComDashboardChart.vue"
import ComDashboardKPI from "@/views/dashboard/components/ComDashboardKPI.vue"
import { storefrontOutline } from 'ionicons/icons';

import { useDashboard } from "@/hooks/useDashboard.js"
import { computed, onMounted, ref } from "vue";
const ctrl = useDashboard()
const {selectedPOSProfiles,onChangePOSProfile,onRefresh} =  useDashboard()

const selectProfile = computed(()=>{

    if(selectedPOSProfiles.value?.length==0){
        return t("POS Profile")
    }
    if(selectedPOSProfiles.value.length==1){
        return selectedPOSProfiles.value[0].name
    }
    return `${t("POS Profile")} (${selectedPOSProfiles.value.length} Selected)`
})

const t = window.t;
const handleRefresh = async (event) => {
    await onRefresh()
  event.target.complete();
};


async function onSelectOutlet(data){
   await onChangePOSProfile()
}

onMounted(async () => {
    const loading = await app.showLoading()
    await ctrl.getRecentData()
    await ctrl.getKpiData()
    await ctrl.getChartData()
    await loading.dismiss()
})


</script>