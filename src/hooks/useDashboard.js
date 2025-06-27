

import dayjs from "dayjs";
import { ref } from "vue";


export function useDashboard(props = null) {
    
    const kpiData = ref()
    const chartData = ref()
    const paymentbreakdown = ref()
    const recentData = ref([])
    const selectedPOSProfiles = ref([])
    const selectedBranch = ref("")
    const saleCouponBreakdown = ref([])
    const couponTransactionSummary = ref([])
 
    async function getKpiData() {
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.sale_kpi",
            {
                param:{
                    pos_profiles: selectedPOSProfiles.value.length==0? []:selectedPOSProfiles.value.map(r=>r.name),
                    business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
                    working_date: app.setting.working_day?.posting_date ?? dayjs().format("YYYY-MM-DD")
                }
            }
        )
        if (res.data) {
            kpiData.value = res.data
        }
    }

    async function getChartData() {
        
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.daily_sale_chart", {
            param: {
                pos_profiles:selectedPOSProfiles.value.length==0? []:selectedPOSProfiles.value.map(r=>r.name),
                business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
                working_date: app.setting.working_day.posting_date
            }
        })
        if (res.data) {
            const current = app.utils.getWeekStartAndEnd()
             const formatDate = d => d.toISOString().split('T')[0];

            const filtered = res.data.filter(item => {
                const itemDate = formatDate(new Date(item.date));
                return itemDate >= current["start"] && itemDate <= current["end"];
            });
            chartData.value = filtered
        }
    }
    async function getPaymentBreakDown() {
    
    const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.payment_breakdown", {
        param: {
            pos_profiles: selectedPOSProfiles.value.length == 0 ? [] : selectedPOSProfiles.value.map(r => r.name),
            business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
            working_date: app.setting.working_day.posting_date
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


    async function getSaleCouponBreakdown(){
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.get_sale_breakdown_by_coupon",{
           param:{
             business_branch:app.setting.property.property_name,
                working_date:app.setting?.working_day?.posting_date ?? dayjs().format("YYYY-MM-DD"),
                pos_profiles:""
           }
        })
        if(res.data){
            saleCouponBreakdown.value = res.data
        }
    }

    async function getCouponTransactionSummary(){
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.get_coupon_transaction_summary",{
           param:{
             business_branch:app.setting.property.property_name,
                working_date:app.setting?.working_day?.posting_date ?? dayjs().format("YYYY-MM-DD"),
                pos_profiles:""
           }
        })
        if(res.data){
            couponTransactionSummary.value = res.data
        }
    }


 

    return {
        kpiData,
        chartData,
        paymentbreakdown,
        recentData,
        selectedPOSProfiles,
        selectedBranch,
        saleCouponBreakdown,
    couponTransactionSummary,
        onRefresh,
        getKpiData,
        getChartData,
        getPaymentBreakDown,
        getRecentData,
        getSaleCouponBreakdown,
        onChangePOSProfile,
        getCouponTransactionSummary
    }

}