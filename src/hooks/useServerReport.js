import { onMounted, ref } from "vue"

export function useServerReport() {
    const reportData = ref()
    
    function getFilters(){
        let filters = {
            business_branch:[app.property_name],
            column_group: "None",//require
            "start_date": "2025-05-01",
            "end_date": "2025-05-21",
             
 

        }
        if(app.route.query){
            filters = {...filters, ...app.route.query}
        }

        return filters;
    }
    async function getReportData() {
        
        const res = await app.getApi("frappe.desk.query_report.run", {
            report_name: app.route.params.report_name,
            filters:getFilters()
        })
        if (res.data) {
            reportData.value = res.data;
        }
    }
    onMounted(async () => {
        const l = app.showLoading()
        await getReportData();

        (await l).dismiss();
    })
    return {
        reportData
    }
}
