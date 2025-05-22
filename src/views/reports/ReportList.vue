<template>
    <ion-page>
        <AppBar>{{ t("Reports") }}</AppBar>

        <ion-content>
            <div class="wrapper-cover flex justify-content-end flex-column align-items-center pb-6">


                <ion-icon :icon="documentOutline" class="text-7xl"></ion-icon>

                <h1 class="mt-2 mb-0">{{ t("Reports") }}</h1>
            </div>





            <ion-item-group>
                <template v-for="(g, index) in reports" :key="index" >
                    <ion-item-divider>
                    <ion-label class="text-2xl text-blue-400">{{ t(g.group) }}</ion-label>
                </ion-item-divider>
                <ion-item  v-for="(d, index) in g.reports" :key="'report_' + index"  button :routerLink="d.url">
                    <ion-label>{{ d.title }}</ion-label>
                </ion-item>
                </template>
                
            </ion-item-group>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { barChartOutline, documentOutline } from 'ionicons/icons';

const t = window.t





const reports = [
    {
        group: "Sale Reports",
        reports: [
            {
                title: "Sale Summary by Category",
                url: "/report/Sale Summary Report?title=Sale Summary By Category&filter_based_on=date_range&row_group=Category&chart_type=bar&show_summary=1&chart_series=Revenue&filterOptions=" +getFilterOption() 
            },
            {
                title: "Sale Summary by Product",
                url: "/report/Sale Summary Report?title=Sale Summary By Product&filter_based_on=date_range&row_group=Product&chart_type=bar&show_summary=1&chart_series=Revenue"
            },
            
            {
                title: "Sale Summary by Date",
                url: "/report/Sale%20Summary%20Report?title=Sale%20Summary%20By%20Product&filter_based_on=date_range&row_group=Date&chart_type=bar&show_summary=1&chart_series=Revenue"
            },

            {
                title: "Hourly Sale Revenue",
                url: "/report/Hourly Sale Revenue?title=Hourly Sale Revenue&filter_based_on=date_range&row_group=Product&chart_type=bar&show_summary=1"
            },
            {
                title: "Daily Sale Transaction",
                url: "/report/Daily%20Sale%20Transaction?title=Daily Sale Transaction&start_date=2025-05-01&end_date=2025-05-22&show_summary=1"
            },
            {
                title: "Sale Payment Type Breakdown",
                url: "/report/Sale Payment Type Breakdown Report?title=Sale Payment Type Breakdown&Sale%20Payment%20Type%20Breakdown%20Report?filter_based_on=Fiscal%20Year&start_date=2025-01-01&end_date=2025-05-22&from_fiscal_year=2025&row_group=Date&column_group=Payment%20Type%20Group&chart_type=bar&show_summary=1"
            },
        ]

    }

]

function getFilterOption(){
    const option = [
    {f:"sale_datexxx",ft:"Datesss",default:"This Month"},
    {f:"outlet",ft:"Link",options:"Outlet"},
    {f:"pos_profile",ft:"Link",options:"POS Profile"},
]
return JSON.stringify(option)
}

</script>

<style scoped>
.wrapper-cover {
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        url(/assets/reportbg.png) no-repeat center center / cover;
    width: 100%;
    height: 30%;
    color: #fff;
}
</style>