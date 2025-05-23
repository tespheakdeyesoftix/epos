

import { ref } from "vue";


export function useDashboard(props = null) {
    const kpiData = ref()
    const chartData = ref()
    const recentData = ref([])
    const selectedPOSProfiles = ref([])

    async function getKpiData() {
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.sale_kpi",
            {
                param:
                {
                    pos_profiles: selectedPOSProfiles.value.length==0? []:selectedPOSProfiles.value.map(r=>r.name),
                    business_branch:app.property_name,
                }
            }
        )
        console.log(res.data)
        if (res.data) {
            kpiData.value = res.data
        }
    }

    async function getChartData() {
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.daily_sale_chart", {
            param: {
                pos_profiles:selectedPOSProfiles.value.length==0? []:selectedPOSProfiles.value.map(r=>r.name),
                business_branch:app.property_name
            }
        })
        if (res.data) {
            chartData.value = res.data
        }
    }

    async function getRecentData() {
        const f= [["docstatus", "=", 1],["business_branch",'=',app.property_name]]
        if(selectedPOSProfiles.value.length>0){
            f.push(["pos_profile","in",selectedPOSProfiles.value.map(r=>r.name)])
        }

        const res = await app.getDocList("Sale", {
            fields: ["name", "posting_date", "grand_total", "customer", "customer_name", "closed_date", "closed_by", "tbl_number"],
            filters: f,
            orderBy: {
                field: 'creation',
                order: 'desc',
            }
        })

        if (res.data) {
            recentData.value = res.data

        }
    }

    async function onRefresh() {
        await getKpiData();
        await getChartData()
        await getRecentData()

    }

    async function onChangePOSProfile() {
        const l = await app.showLoading()
        await onRefresh();
        await l.dismiss();


    }


    return {
        kpiData,
        chartData,
        recentData,
        selectedPOSProfiles,
        onRefresh,
        getKpiData,
        getChartData,
        getRecentData,
        onChangePOSProfile
    }

}