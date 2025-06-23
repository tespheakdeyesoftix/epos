<template>
    <ion-page>
        <AppBar>{{ t("Dashboard") }}</AppBar>
        <ion-content > 
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <div class="ion-margin-top" style="margin-left: 10px;">
 <ComSelect docType="Business Branch" v-model="selectedBranch" @onSelected="onSelectBranch" modalType="sheet_modal">
                 
                <ion-chip>
                     <ion-icon :icon="storefrontOutline" color="primary"></ion-icon>
                    <ion-label>
                         {{ selectBranch }}
                    </ion-label>
                    </ion-chip>
            </ComSelect>
            <ComSelect docType="POS Profile" :clearselected=clearselectedvalues :filters="[['is_edoor_profile','=',0],['business_branch','=',selectedBranches]]" multiple v-model="selectedPOSProfiles" @onSelected="onSelectOutlet" modalType="sheet_modal">
              
                <ion-chip>
                     <ion-icon :icon="calculatorOutline" color="primary"></ion-icon>
                    <ion-label>
                         {{ selectedPOSProfiles.map(x=>x.name).join(",") }}
                    </ion-label>
                    </ion-chip>
            </ComSelect>

            <ComSelectDateFilter     v-model ="selectedDate" :clear="true"  @onSelect="onSelectedDate" @onClear="onClearDate" modalType="sheet_modal">
                 <ion-chip>
                     <ion-icon :icon="calendarOutline" color="primary"></ion-icon>
                    <ion-label>
                   
                        <template v-if="selectedDate">
      <span v-if="selectedDate.timespan">{{ t(selectedDate.timespan) }}</span>
                        <span v-else>{{ selectedDate.start_date  }} to {{ selectedDate.end_date }}</span>
                        
                        </template>
                        <span v-else>{{ t("Select Date") }}</span>
                    </ion-label>
                    </ion-chip>
            </ComSelectDateFilter>

            </div>
             
            <stack class="ion-padding">
                <div style="margin-bottom: -15px;">
                    <ComDashboardKPI :data="kpiData" />
                </div>
                 <div style="margin-bottom: -8px;">
                    <ComDashboardChart :data="chartData" />
                </div>
                <div style="margin-bottom: -5px;">
                    <ComPaymentBreakdown :data="paymentbreakdown"/>
                </div>
                <ComRecentOrder :data="recentData" />
            </stack>
        </ion-content>
    </ion-page>
    
</template>
<script setup >

import ComRecentOrder from "@/views/dashboard/components/ComRecentOrder.vue"
import ComDashboardChart from "@/views/dashboard/components/ComDashboardChart.vue"
import ComDashboardKPI from "@/views/dashboard/components/ComDashboardKPI.vue"
import ComPaymentBreakdown from "@/views/dashboard/components/ComPaymentBreakdown.vue"
import { calculatorOutline, calendarOutline, storefrontOutline } from 'ionicons/icons';

import { useDashboard } from "@/hooks/useDashboard.js"
import { computed, onMounted, ref } from "vue";
import { selectDate } from "@/helpers/utils";
const {selectedPOSProfiles,onChangePOSProfile,onRefresh,kpiData,chartData,recentData,paymentbreakdown,selectedBranch} =  useDashboard()
const property_name = app.property_name;
const selectedBranches = ref("")
const clearselectedvalues = ref(false)
const selectedDate = ref(false)
const selectProfile = computed(()=>{

    if(selectedPOSProfiles.value?.length==0){
        return t("POS Profile")
    }
    if(selectedPOSProfiles.value.length==1){
        return selectedPOSProfiles.value[0].name
    }
    return `${t("POS Profile")} (${selectedPOSProfiles.value.length} Selected)`
})

const selectBranch = computed(()=>{
    if((selectedBranch.value?.length ?? 0)==0){
        return t("Branch")
    }
    else{
        return selectedBranch.value
    }
})

const t = window.t;
const handleRefresh = async (event) => {
    await onRefresh()
    event.target.complete();
};


async function onSelectOutlet(data){
    clearselectedvalues.value = false
    await onChangePOSProfile()
}

async function onSelectBranch(data){
    clearselectedvalues.value = true
    selectedBranches.value = data.name
    selectedPOSProfiles.value = []
    await onChangePOSProfile()
}

onMounted(async () => {
    const loading = await app.showLoading()
    await onRefresh()
    await loading.dismiss()
})


</script>