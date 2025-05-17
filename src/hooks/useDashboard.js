

import {  ref } from "vue";


export function useDashboard(props = null) {
    const kpiData = ref()
    const chartData = ref()
    const recentData = ref([])

    function getKpiData(){

    }
    
    function getChartData(){

    }
    
    async function getRecentData(){
        const res =await app.getDocList("Sale")
      
        if (res.data){
            recentData.value = res.data
           
        }
    }

    function onRefresh(){

    }


  return {
   kpiData,
   chartData,
   recentData,
   onRefresh,
   getKpiData,
   getChartData,
   getRecentData
  }

}