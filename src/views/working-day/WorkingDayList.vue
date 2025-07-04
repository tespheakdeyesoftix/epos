<template>
    <ion-page>
        <AppBar>{{ t("Working Day List") }}</AppBar>
        <ion-content >

          
            <DocList docType="Working Day" :options="options"
            @onRowDblClick="onRowDblClick"
            >
              <template #is_closed="{item}">
                <ComStatus status="Opened" color="danger" v-if="item.is_closed == 0" />
                <ComStatus status="Closed" v-else />
              </template>
            </DocList>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';

const plateform = ref(app.utils.getPlateform())
 
const t = window.t
const options = {
    columns:[
        {fieldname:"name",header:"Working Day #",url:'/working-day-detail' },
        {fieldname:"posting_date",header:"Date" ,fieldtype:"Date"},
        {fieldname:"pos_profile",header:"POS Profile"},
        {fieldname:"outlet",header:"Outlet"},
        {fieldname:"created_by",header:"Created By"},
        {fieldname:"closed_date",header:"Closed Date" ,fieldtype:"Date"},
        {fieldname:"closed_by",header:"Closed By"},
        {fieldname:"is_closed",header:"Status"}, 
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[
    ["business_branch","=",app.setting.property.property_name]
],

  filterOptions:[
    {fieldname:"posting_date", fieldtype:"Date", label:t('Date'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal'},
    {fieldname:"pos_profile", fieldtype:"Link",options:"POS Profile", label:t('POS Profile')},
    {fieldname:"outlet", fieldtype:"Link",options:"Outlet", label:t('Outlet')},
    {fieldname:"is_closed", fieldtype:"Select",options:[{label:t("Opened"),name:0},{label:t("Closed"),name:1}], label:t("Status"),clear:true}
   
     
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/working-day-detail/" + data.name, "forward", "push");
}
</script>