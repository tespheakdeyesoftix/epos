<template>
    <ion-page>
        <AppBar>{{ t("Coupon Codes") }}</AppBar>
        <ion-content  ref="pageRef" :scrollEvents="true" @ionScroll="handleScroll">
 
            <DocList docType="Coupon Codes" :options="options"
            v-model:selectedRow="selectedRow"
            @onRowDblClick="onRowDblClick"
            >
                
                <template #coupon_status="{ item, index }">
                    <ComStatus :status="item.coupon_status"/>
                </template>
                <template #sale_date="{ item, index }">
                    
                    <ion-label v-if="(item.sale_date || '')!=''">{{ dayjs(item.sale_date).format("DD/MM/YYYY") }}</ion-label>
                    <ion-label v-else></ion-label>
                </template>
                
            </DocList>
             
            <transition name="fade">
        <ion-fab v-if="showFab" vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="scrollToTop" color="primary">
            <ion-icon :icon="arrowUpOutline" />
          </ion-fab-button>
        </ion-fab>
      </transition>

        </ion-content>
        <ComFooter>
             <ion-button :disabled="!selectedRow" :routerLink="'/coupon-detail/' + selectedRow?.name">{{ t("View Detail") }}</ion-button>
            <ion-button :disabled="!selectedRow">{{ t("Edit") }}</ion-button>
            <ion-button color="danger" :disabled="!selectedRow">{{ t("Delete") }}</ion-button>
        </ComFooter>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';

import dayjs from 'dayjs';
import { arrowUpOutline } from 'ionicons/icons';
const plateform = ref(app.utils.getPlateform())
const pageRef = ref(null)
const selectedRow = ref()
const t = window.t
const options = {
    columns:[
        {fieldname:"coupon",header:"Coupon #",url:"/coupon-detail",id_field:"name"},
        {fieldname:"coupon_status",header:"Status",},
        {fieldname:"sale",header:"Sale #", url:"/sale-detail"},
        {fieldname:"sale_date",header:"Sale Date", fieldtype:"Date"},
        {fieldname:"customer_name",header:"Customer", url:"/customer-detail",id_field:"customer"},
        {fieldname:"price",header:"Price",fieldtype:"Currency"},
        {fieldname:"coupon_value",header:"Cupon Value",fieldtype:"Currency"},
        {fieldname:"created_by",header:"By",},
        {fieldname:"creation",header:"Date",fieldtype:"Datetime"},
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name","customer"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[],
  filterOptions:[
    {fieldname:"coupon_status", fieldtype:"Select", label:t('Coupon Status'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal',options:['Used','Unused','Redeemed','Expired']},
    {fieldname:"sale_date", fieldtype:"Date",   label:t('Sale Date')},
    {fieldname:"working_day", fieldtype:"Link",options:"Working Day", label:t("Working Day")},
    {fieldname:"cashier_shift", fieldtype:"Link",options:"Cashier Shift", label:t("Cashier Shift")}
    
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/coupon-detail/" + data.name, "forward", "push");
}
const showFab = ref(false)

const scrollToTop = () => {
  pageRef.value?.$el.scrollToTop(500)
}

const handleScroll = (ev) => {
  const scrollTop = ev.detail.scrollTop;
  showFab.value = scrollTop > 200; // show after scrolling 200px
};

</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>