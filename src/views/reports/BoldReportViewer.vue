<template>
    <ion-page>
<AppBar>{{ t("Reports") }}</AppBar>
    <ion-content>
        <ion-split-pane when="xs" content-id="main" style="--side-width:25%">
            <ion-menu content-id="main">
                <ion-content class="ion-padding">
                    <ComReportList @onSelectReport="onSelectReport" />
                </ion-content>
            </ion-menu>

            <div class="ion-page" id="main">
               
                <ion-content class="ion-padding">
                    <div style="height:90vh" id="main_server_report_viewer_backend"
                        class="flex align-items-center justify-content-center">

                        <div class="flex flex-column align-items-center gap-5" v-if="!selectedReport">
                            <img :src="reportpng" width="100" />
                            {{t("Please select a report to view your report.")}}
                        </div>
                    </div>
                </ion-content>
            </div>
        </ion-split-pane>
         
        </ion-content>
    </ion-page>
    
 
</template>
<script setup>
import { ref, onMounted } from 'vue'
import ComReportList from "@/views/reports/components/ComReportList.vue"
import { IonSplitPane } from '@ionic/vue'
const t = window.t
const isViewerReady = ref(false)
const selectedReport = ref()
const setting = ref({})
function onSelectReport(p) {
    selectedReport.value = p
    let report_params = [
        { name: 'printed_by', values: [setting.value.full_name] },
        { name: 'username', values: [setting.value.user] },
        { name: 'report_title', values: [p.report_title] },
        { name: 'property', values: [setting.value.property] },
        { name: 'start_date', values: [setting.value.working_day.posting_date] },
        { name: 'end_date', values: [setting.value.working_day.posting_date] },
    ]

    if (selectedReport.value.filter_default_value) {
        const default_filter = JSON.parse(selectedReport.value.filter_default_value)

        if (default_filter.start_date) {
            report_params = report_params.filter(r => r.name != 'start_date')
            report_params.push({ name: 'start_date', values: [get_date_by_timestamp(default_filter.start_date)] })
        }
        if (default_filter.end_date) {

            report_params = report_params.filter(r => r.name != 'end_date')
            report_params.push({ name: 'end_date', values: [get_date_by_timestamp(default_filter.end_date)] })

        }

        if (default_filter.row_group) {
            report_params.push({ name: 'row_group', values: [default_filter.row_group] })
        }
        if (default_filter.order_by) {
            report_params.push({ name: 'order_by', values: [default_filter.order_by] })
        }
        if (default_filter.group_by) {
            report_params.push({ name: 'group_by', values: [default_filter.group_by] })
        }
        if (default_filter.show_package_breakdown) {
            report_params.push({ name: 'show_package_breakdown', values: [default_filter.show_package_breakdown] })

        }
        if (default_filter.show_all_breakdown) {
            report_params.push({ name: 'show_all_breakdown', values: [default_filter.show_all_breakdown] })
        }
        if (default_filter.show_all_breakdown) {
            report_params.push({ name: 'show_all_breakdown', values: [default_filter.show_all_breakdown] })
        }
        if (default_filter.status) {
            report_params.push({ name: 'status', values: [default_filter.status] })
        }
        if (default_filter.group_by_date) {
            report_params.push({ name: 'group_by_date', values: [default_filter.group_by_date] })
        }
        if (default_filter.group_by_date) {
            report_params.push({ name: 'group_by_date', values: [default_filter.group_by_date] })
        }
        if (default_filter.show_chart) {
            report_params.push({ name: 'show_chart', values: [default_filter.show_chart] })
        }
        if (default_filter.show_summary) {
            report_params.push({ name: 'show_summary', values: [default_filter.show_summary] })
        }
        if (default_filter.show_occupy_only) {
            report_params.push({ name: 'show_occupy_only', values: [default_filter.show_occupy_only] })
        }


    }

    $("#main_server_report_viewer_backend").boldReportViewer({
        reportServerUrl: setting.value.server_report_url,
        reportServiceUrl: setting.value.report_service_url,
        reportPath: selectedReport.value.server_report_path,
        serviceAuthorizationToken: "bearer " + setting.value.server_report_token,
        parameters: report_params,
        printMode: true,
        zoomFactor: 1.25,
        enableViewState: true,  // Enables the Save View feature
        toolbarSettings: {
            items: ej.ReportViewer.ToolbarItems.All,
            showSaveView: true,  // Shows Save View button on the toolbar
            showViewList: true,  // Enables selecting a saved view
        },
        printAction: function (args) {
        
            args.printOption.pageSize = "Landscape"; // Force Landscape mode
        }
        ,
        reportLoaded: function (event) {
            setTimeout(() => {
                let property = document.querySelector("#main_server_report_viewer_Param_101")

            }, 5000);

        }
    });
}



function get_date_by_timestamp(timestap) {

    if (timestap === "current_working_date") {
        return setting.value.working_day.posting_date;
    } else if (timestap === "today") {
        return moment().format("YYYY-MM-DD");
    } else if (timestap === "previous_working_day") {
        return moment(setting.value.working_day.posting_date).add(-1, "days").format("YYYY-MM-DD");
    } else if (timestap === "start_mtd") {
        return moment(setting.value.working_day.posting_date).startOf("month").format("YYYY-MM-DD");
    } else if (timestap === "end_mtd") {
        return moment(setting.value.working_day.posting_date).endOf("month").format("YYYY-MM-DD");
    } else if (timestap === "start_current_mtd") {
        return moment().startOf("month").format("YYYY-MM-DD");
    } else if (timestap === "end_current_mtd") {
        return moment().endOf("month").format("YYYY-MM-DD");
    } else if (timestap === "start_ytd") {
        return moment(setting.value.working_day.posting_date).startOf("year").format("YYYY-MM-DD");
    } else if (timestap === "end_ytd") {
        return moment(setting.value.working_day.posting_date).endOf("year").format("YYYY-MM-DD");
    } else {
        return setting.value.working_day.posting_date;
    }
}


function loadScript(src) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`)
        if (existing) return resolve()

        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
    })
}

function loadCss(href) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`link[href="${href}"]`)
        if (existing) return resolve()

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = resolve
        link.onerror = reject
        document.head.appendChild(link)
    })
}

onMounted(async () => {
    try {
        // Load CSS
        await loadCss('https://cdn.boldreports.com/6.3.24/content/v2.0/tailwind-light/bold.report-viewer.min.css')

        // Load JS dependencies in order
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js')
        await loadScript('https://cdn.boldreports.com/6.3.24/scripts/v2.0/common/bold.reports.common.min.js')
        await loadScript('https://cdn.boldreports.com/6.3.24/scripts/v2.0/common/bold.reports.widgets.min.js')
        await loadScript('https://cdn.boldreports.com/6.3.24/scripts/v2.0/bold.report-viewer.min.js')


        isViewerReady.value = true

        const res = await app.getApi("epos_restaurant_2023.api.api.get_server_report_setting")
        if (res.data) {
            setting.value = res.data
        }

    } catch (err) {
        console.error('Failed to load Bold Reports viewer', err)
    }

})
</script>