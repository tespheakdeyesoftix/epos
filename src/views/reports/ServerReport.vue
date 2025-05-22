<template>
       
  <ion-page>
    <ToolBar>{{ t(query.title) }}
      
         
    </ToolBar>
    <ion-content class="ion-padding">
      <stack>
           <ComReportFilter />
           <ComReportSummary :data="reportData?.report_summary"/>
           <ComReportChart :data="reportData?.chart"/>
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
const {reportData}  = useServerReport();
const t = window.t;
const query = app.route.query;


</script>