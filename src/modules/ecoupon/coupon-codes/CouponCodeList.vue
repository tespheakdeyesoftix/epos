<template>
    <ion-page>
        <AppBar>{{ t("Coupon Codes") }}</AppBar>
        <ion-content>
            <DocList docType="Coupon Codes" :options="options"
            @onRowDblClick="onRowDblClick"
            >
                <template #name="{ item, index }">
                    <ion-button class="ion-no-margin" fill="clear" :routerLink="'/coupon-detail/' + item.name">
                        {{item.coupon}}
                    </ion-button>
                </template>
                <template v-if="plateform == 'mobile'" v-slot:default="{ item }">
                    <ComSaleOrderCard v-for="(d,index) in item" :key="index"  :data="d"/>
                </template>
            </DocList>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import ComSaleOrderCard from '@/views/sales/components/ComSaleOrderCard.vue';
const plateform = ref(app.utils.getPlateform())

const t = window.t
const options = {
    columns:[
        {fieldname:"name",header:"Coupon #",},
        {fieldname:"coupon_status",header:"Status",},
        {fieldname:"sale",header:"Sale #",},
        {fieldname:"customer_name",header:"Customer",},
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["coupon"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[],
  filterOptions:[
    {fieldname:"coupon_status", fieldtype:"Select", label:t('Coupon Status'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal',options:['Used','Unused','Redeemed','Expired'],multiple:true},
    // {fieldname:"pos_profile", fieldtype:"Link",options:"POS Profile", label:t('POS Profile')},
    // {fieldname:"working_day", fieldtype:"Link",options:"Working Day", label:t("Working Day")},
    // {fieldname:"cashier_shift", fieldtype:"Link",options:"Cashier Shift", label:t("Cashier Shift")},
    // {fieldname:"pos_station_name", fieldtype:"Link",options:"POS Station", label:t("POS Station"),multiple:true},
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/coupon-detail/" + data.name, "forward", "push");
}
</script>