<template>
       
  <ion-page>
    <ToolBar>{{ t(query.title) }}
      <template #end>

<ComPopOver v-if="reportData?.report_summary || reportData?.chart"> 
  <ion-button>
    <ion-icon :icon="settingsOutline" slot="icon-only" />
  </ion-button>
  <template #content="{ close }">
    <ion-list>
      <ion-item button  @click="onToggleSumamry(close)" v-if="reportData?.report_summary"> 
        {{ t("Show/Hide Summary") }}
      </ion-item>
      <ion-item button @click="onToggleReportChart(close)" v-if="reportData?.chart">
        {{ t("Show/Hide Chart") }}
      </ion-item>

    </ion-list>
  </template>
</ComPopOver>
</template>
    </ToolBar>
    <ion-content class="ion-padding">
     
      <stack>

           <ComReportFilter @onFilter="onPreviewReport" :filterOptions="query.filterOptions"/>
        
           <ComReportSummary v-if="showSummary" :data="reportData?.report_summary"/>
           <ComReportChart v-if="showReportChart" :data="reportData?.chart" :chartSeries="query.chart_series"/>
           <ComReportData :data="reportData?.result" :columns="reportData?.columns"/>
          </stack>
        </ion-content>
        </ion-page>
</template>
<script setup>
import {useServerReport} from "@/hooks/useServerReport.js"
import ComReportChart from "@/views/reports/components/ComReportChart.vue"
import ComReportFilter from "@/views/reports/components/ComReportFilter.vue"
import ComReportSummary from "@/views/reports/components/ComReportSummary.vue"
import ComReportData from "@/views/reports/components/ComReportData.vue"
import {  settingsOutline } from "ionicons/icons"
import { ref } from "vue"
const {reportData}  = useServerReport();
const t = window.t;
const query = app.route.query;
const showSummary = ref(true)
const showReportChart = ref(true)
function onPreviewReport(filter){
  alert("you preview report")
}

function onToggleSumamry(close){
  showSummary.value = !showSummary.value;
   close();
}
function onToggleReportChart(close){
  showReportChart.value = !showReportChart.value;
   close();
}

</script>