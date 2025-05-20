

import { ref } from "vue";


export function useDashboard(props = null) {
    const kpiData = ref()
    const chartData = ref()
    const recentData = ref([])

    async function getKpiData() {
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.sale_kpi",
            { 
                param: 
                { 
                    pos_profiles: ["Main POS Profile"], 
                    date: "2025-02-06" 
                } 
            }
        )
        if (res.data) {
            kpiData.value = res.data
        }
    }

    async function getChartData() {
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.daily_sale_chart",{
           param:{
            pos_profiles:["Main POS Profile"],
            year:2025,
            month:5
           } 
        })
        if(res.data){
            chartData.value = res.data
        }
    }

    async function getRecentData() {
        const res = await app.getDocList("Sale",{
            fields:["name","posting_date","grand_total","customer","customer_name","closed_date","closed_by","tbl_number"],
            filters:[["docstatus","=",1]]
        })

        if (res.data) {
            recentData.value = res.data

        }
    }

    function onRefresh() {

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