<template>
   <ComRecentSaleCouponTable :data="data" v-if="plateform=='desktop'"/>
   <ComSaleOrderCard v-for="(d,index) in data" :key="index" :data="d" v-else/> 
   <ion-button  expand="full" fill="clear" routerLink="/top-up-list">{{ t("View all top ups") }}</ion-button>
</template>
<script setup>
import ComSaleOrderCard  from "@/views/sales/components/ComSaleOrderCard.vue"
import ComRecentSaleCouponTable  from "@/modules/ecoupon/dashboard/components/recent-transaction/ComRecentSaleCouponTable.vue"
import { onMounted, ref } from "vue";
const plateform =  app.utils.getPlateform();
const t = window.t;
const data = ref([])
async function getData(){
    const res =  await app.getDocList("Sale",{
        fields:["name","customer","customer_name","grand_total","creation","total_quantity","owner"],
        filters:[
            ["business_branch","=",app.setting.property.property_name],
            ["sale_type","=",'Top Up']
        ],
        limit:20,
        orderBy: {
            field: 'creation',
            order: 'desc',
        }
    })
    if(res.data){
        data.value = res.data;
    }
}

onMounted(async ()=>{
await getData();
})
</script>