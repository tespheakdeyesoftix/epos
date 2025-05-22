<template>
<ion-page>
    <AppBar>{{ t("Reports") }}</AppBar>
    <ion-content>
    <ion-list>
        <ion-item v-for="(d,index) in reports" :key="index" button :routerLink="d.url">
            <ion-label>{{d.title}}</ion-label>
        </ion-item>
    </ion-list> 
    </ion-content>
</ion-page>    
</template>
<script setup>
const t = window.t

const reports = [
    { 
    title:"Sale Summary by Category",
    url:"/report/Sale Summary Report?title=Sale Summary By Category&filter_based_on=date_range&row_group=Category&chart_type=bar&show_summary=1"
    },
    { 
    title:"Sale Summary by Product",
    url:"/report/Sale Summary Report?title=Sale Summary By Product&filter_based_on=date_range&row_group=Product&chart_type=bar&show_summary=1"
    },
    { 
    title:"Hourly Sale Revenue",
    url:"/report/Hourly Sale Revenue?title=Hourly Sale Revenue&filter_based_on=date_range&row_group=Product&chart_type=bar&show_summary=1"
    }
]

</script>