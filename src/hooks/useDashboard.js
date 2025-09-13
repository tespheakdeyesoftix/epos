

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
    const couponUsedSummaryByPOSStation = ref([])
    const storeRevenueSummaryData = ref([])

    function getWorkingDate() {
        return app.setting?.working_day?.posting_date || dayjs().format("YYYY-MM-DD")
    }
    async function getKpiData() {
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.sale_kpi",
            {
                param: {
                    pos_profiles: selectedPOSProfiles.value.length == 0 ? [] : selectedPOSProfiles.value.map(r => r.name),
                    business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
                    working_date: getWorkingDate()
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
                pos_profiles: selectedPOSProfiles.value.length == 0 ? [] : selectedPOSProfiles.value.map(r => r.name),
                business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
                working_date: getWorkingDate()
            }
        })
        if (res.data) {

            chartData.value = res.data
        }
    }




    async function getPaymentBreakDown() {

        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.payment_breakdown", {
            param: {
                pos_profiles: selectedPOSProfiles.value.length == 0 ? [] : selectedPOSProfiles.value.map(r => r.name),
                business_branch: (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value,
                working_date: getWorkingDate()
            }
        })
        if (res.data) {
            paymentbreakdown.value = res.data
        }
    }


    async function getRecentData() {
        let branch = (selectedBranch.value?.length ?? 0) == 0 ? "" : selectedBranch.value
        const f = [["docstatus", "=", 1]]
        if (branch) {
            f.push(["business_branch", '=', branch])
        }
        if (selectedPOSProfiles.value.length > 0) {
            f.push(["pos_profile", "in", selectedPOSProfiles.value.map(r => r.name)])
        }
        const res = await app.getDocList("Sale", {
            fields: ["name", "posting_date", "grand_total", "customer", "customer_name", "closed_date", "closed_by", "tbl_number", "custom_bill_number"],
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

        await getRevenueSummaryByStore()
        getChartData()
        getPaymentBreakDown()
        getRecentData()



    }

    async function onChangePOSProfile() {
        const l = await app.showLoading()
        await onRefresh();
        await l.dismiss();
    }


    async function getSaleCouponBreakdown() {
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.get_sale_breakdown_by_coupon", {
            param: {
                business_branch: app.setting.property.property_name,
                working_date: getWorkingDate(),
                pos_profiles: ""
            }
        })
        if (res.data) {
            saleCouponBreakdown.value = res.data
        }
    }

    async function getCouponTransactionSummary() {
        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.get_coupon_transaction_summary", {
            param: {
                business_branch: app.setting.property.property_name,
                working_date: getWorkingDate(),
                pos_profiles: ""
            }
        })
        if (res.data) {
            couponTransactionSummary.value = res.data
        }
    }

    async function getCouponUseSummaryByPOSStation() {

        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.get_summary_coupon_used_by_pos_station", {
            param: {
                business_branch: app.setting.property.property_name,
                working_date: getWorkingDate(),
                pos_profiles: ""
            }
        })
        if (res.data) {
            couponUsedSummaryByPOSStation.value = res.data
        }
    }

    async function getRevenueSummaryByStore() {

        const res = await app.postApi("epos_restaurant_2023.api.mobile.dashboard.get_revenue_summary_by_store", {
            param: {
                business_branch: app.setting.property.property_name,
                working_date: getWorkingDate(),
                pos_profiles: ""
            }
        })
        if (res.data) {
            storeRevenueSummaryData.value = res.data
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
        couponUsedSummaryByPOSStation,
        storeRevenueSummaryData,
        onRefresh,
        getKpiData,
        getChartData,
        getPaymentBreakDown,
        getRecentData,
        getSaleCouponBreakdown,
        onChangePOSProfile,
        getCouponTransactionSummary,
        getCouponUseSummaryByPOSStation,
        getRevenueSummaryByStore
    }

}