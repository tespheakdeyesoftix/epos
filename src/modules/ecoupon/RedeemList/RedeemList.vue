<template>
    <ion-page>
        <AppBar>{{ t("Redeem List") }}</AppBar>
        <ion-content ref="contentRef">
            <DocList docType="Sale" :options="options"
            @onRowDblClick="onRowDblClick"
            :contentRef="contentRef"
            >
                
                <template v-if="plateform == 'mobile'" v-slot:default="{ item }">
                    <ComTopUpCard v-for="(d,index) in item" :key="index"  :data="d"/>
                </template>
            </DocList>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import ComTopUpCard from '@/modules/ecoupon/TopUpList/components/ComTopUpCard.vue';
 const contentRef = ref(null)
const plateform = ref(app.utils.getPlateform())

const t = window.t
const options = {
    columns:[
        {fieldname:"name",header:"Sale #",url:"/sale-detail"},
        {fieldname:"pos_station_name",header:"Station"},
        {fieldname:"posting_date",header:"Sale Date",fieldtype:"Date"},
        {fieldname:"total_quantity",header:"Quantity",fieldtype:"Float"},
        {fieldname:"grand_total",header:"Grand Total",fieldtype:"Currency"},
        {fieldname:"closed_by",header:"User"},
        {fieldname:"closed_date",header:"Close Date",fieldtype:"Datetime"},
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name", "posting_date","pos_station_name","total_quantity", "grand_total", "customer", "customer_name", "closed_date", "closed_by", "tbl_number","custom_bill_number"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[["docstatus","=",1],["sale_type","=",'Redeem']],

  filterOptions:[
    {fieldname:"posting_date", fieldtype:"Date", label:t('Sale Date'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal'},
    {fieldname:"pos_profile", fieldtype:"Link",options:"POS Profile", label:t('POS Profile')},
    {fieldname:"working_day", fieldtype:"Link",options:"Working Day", label:t("Working Day")},
    {fieldname:"cashier_shift", fieldtype:"Link",options:"Cashier Shift", label:t("Cashier Shift")},
    {fieldname:"pos_station_name", fieldtype:"Link",options:"POS Station", label:t("POS Station"),multiple:true},
  ],
    noRecordActions:[
   {title:t("Create New Redeem"),router_link:"/redeem","color":"primary"},
]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/sale-detail/" + data.name, "forward", "push");
}
</script>