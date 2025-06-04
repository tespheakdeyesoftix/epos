

import { ref } from "vue";


export function useDashboard(props = null) {
    const kpiData = ref()
    const chartData = ref()
    const paymentbreakdown = ref()
    const recentData = ref([])
    const selectedPOSProfiles = ref([])
    const selectedBranch = ref("")
    function getWeekStartAndEnd(date = new Date()) {
        const currentDate = new Date(date);
        const day = currentDate.getDay();
        const diffToMonday = (day === 0 ? -6 : 1 - day);
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() + diffToMonday);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const formatDate = d => d.toISOString().split('T')[0];
        return {
            start: formatDate(weekStart),
            end: formatDate(weekEnd)
        };
    }
    async function getKpiData() {
        const formatDate = d => d.toISOString().split('T')[0];
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.sale_kpi",
            {
                param:{
                    pos_profiles: selectedPOSProfiles.value.length==0? []:selectedPOSProfiles.value.map(r=>r.name),
                    business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
                    working_date: formatDate(new Date())
                }
            }
        )
        if (res.data) {
            kpiData.value = res.data
        }
    }

    async function getChartData() {
        const formatDate = d => d.toISOString().split('T')[0];
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.daily_sale_chart", {
            param: {
                pos_profiles:selectedPOSProfiles.value.length==0? []:selectedPOSProfiles.value.map(r=>r.name),
                business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
                working_date: formatDate(new Date())
            }
        })
        if (res.data) {
            const current = getWeekStartAndEnd()
            const filtered = res.data.filter(item => {
                const itemDate = formatDate(new Date(item.date));
                return itemDate >= current["start"] && itemDate <= current["end"];
            });
            chartData.value = filtered
        }
    }
    async function getPaymentBreakDown() {
    const formatDate = d => d.toISOString().split('T')[0];
    const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.payment_breakdown", {
        param: {
            pos_profiles: selectedPOSProfiles.value.length == 0 ? [] : selectedPOSProfiles.value.map(r => r.name),
            business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
            working_date: formatDate(new Date())
        }
    })
    if (res.data) {
        paymentbreakdown.value = res.data
    }
}


    async function getRecentData() {
        let branch = (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value
        const f= [["docstatus", "=", 1]]
        if(branch){
            f.push(["business_branch",'=',branch])
        }
        if(selectedPOSProfiles.value.length>0){
            f.push(["pos_profile","in",selectedPOSProfiles.value.map(r=>r.name)])
        }
        const res = await app.getDocList("Sale", {
            fields: ["name", "posting_date", "grand_total", "customer", "customer_name", "closed_date", "closed_by", "tbl_number","custom_bill_number"],
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
        await getPaymentBreakDown()
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
        paymentbreakdown,
        recentData,
        selectedPOSProfiles,
        selectedBranch,
        onRefresh,
        getKpiData,
        getChartData,
        getPaymentBreakDown,
        getRecentData,
        
        onChangePOSProfile
    }

}