import { onMounted, ref } from "vue"

export function useServerReport() {
    const reportData = ref()
    const reportFilters = ref()
    
    function getFilters(filter){
        
        let filters = {
            business_branch:[app.setting.property?.property_name],
        }
        if(app.route.query){
            filters = {...filters, ...app.route.query}
        }

        if(filter){
            // remove null and empty key
            const _filter = Object.fromEntries(
                Object.entries(filter).filter(([_, value]) => value !== null && value !== "")
              );
            filters = {...filters, ..._filter }
        }

        // delete fitler option from filter
        delete filters.filterOptions;
        return filters;
    }
    async function getReportData(fitler=null) {
        
        const res = await app.getApi("frappe.desk.query_report.run", {
            report_name: app.route.params.report_name,
            filters:getFilters(fitler)
        })
        if (res.data) {
            reportData.value = res.data;
        }
    }

    async function onPreviewReport(filter){
        reportFilters.value = filter;
        const l =await app.showLoading()
        await getReportData(filter);

        await l.dismiss();
      }
    async function onRefresh(){
    await getReportData(reportFilters.value);
}
    // onMounted(async () => {
    //     const l =await app.showLoading()
    //     await getReportData();

    //     await l.dismiss();
    // })
    return {
        onPreviewReport,
        onRefresh,
        reportData
    }
}
