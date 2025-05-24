<template>
    <ion-page>
        <AppBar>{{ t("Reports") }}</AppBar>

        <ion-content>
            <div class="wrapper-cover flex justify-content-end flex-column align-items-center pb-6">


                <ion-icon :icon="documentOutline" class="text-7xl"></ion-icon>

                <h1 class="mt-2 mb-0">{{ t("Reports") }}</h1>
            </div>

 

            <ion-item-group>
                <template v-for="(g, index) in reports?.filter(p=>!p.parent_mobile_reports)" :key="index" >
                    <ion-item-divider>
                        <ion-label class="">{{ t(g.report_title) }}</ion-label>
                    </ion-item-divider>
                    <ion-item  v-for="(d, index) in reports.filter(x=>x.parent_mobile_reports==g.name)" :key="'report_' + index"  button :routerLink="getReportUrl(d)">
                        <ion-label>{{ t(d.report_title) }}</ion-label>
                    </ion-item>
                </template>
                
            </ion-item-group>
        </ion-content>
    </ion-page>
</template>
<script setup>

import { barChartOutline, documentOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';

const t = window.t

const reports =ref([])
  
async function getReport(){
    const res =await app.getDocList("Mobile Reports",{
        fields:["name","parent_mobile_reports","report_title","report_url","filter_options"],
        orderBy: {
            field: 'sort_order',
            order: 'asc',
        },
        limit: 10000
    })

    if(res.data){
        reports.value = res.data
    }

}

function getReportUrl(p){
    let url = p.report_url + "&title=" + p.report_title
    url = url + "&filterOptions=" + p.filter_options
    return url;
}
onMounted(async ()=>{
    const loading = await app.showLoading();
    await getReport()
    await loading.dismiss()

})

</script>

<style scoped>
.wrapper-cover {
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        url(/assets/reportbg.png) no-repeat center center / cover;
    width: 100%;
    height: 30%;
    color: #fff;
}
ion-item-divider{
    --background: #D4C9BE;
}
</style>
