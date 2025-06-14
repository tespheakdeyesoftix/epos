<template>
    <ion-page>
        <AppBar>{{ t("Customer List") }}</AppBar>
        <ion-content>
            <DocList docType="Customer" :options="options"
            @onRowDblClick="onRowDblClick"
            >
                 <template #name="{ item, index }">
                   <ion-button class="ion-no-margin" fill="clear" expand="full" :routerLink="'sale-detail/' + item.name">
                    {{item.name}} - {{ item.customer_name_en }}
                    </ion-button>
                </template>
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
 
const plateform = ref(app.utils.getPlateform())

const t = window.t
const options = {
    columns:[
        {fieldname:"name",header:"Customer #"},
        {fieldname:"customer_name_kh",header:"Name Kh"},
        {fieldname:"phone_number",header:"Phone #"},
        {fieldname:"modified",header:"Last Modified",fieldtype:"Datetime"},
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name","customer_name_en","customer_name_kh","phone_number","modified"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[["is_disabled","=",0]],

  filterOptions:[
    {fieldname:"customer_group", fieldtype:"Link",options:"Customer Group", label:t('Customer Group'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal'},
   
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/customer/" + data.name, "forward", "push");
}
</script>