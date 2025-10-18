<template>
    <ion-page>
        <AppBar>{{ t("Cashier Shift List") }}</AppBar>
        <ion-content >
          
            <DocList docType="Cashier Shift" :options="options"
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
        {fieldname:"name",header:"Cashier Shift #",url:'/shift-detail' },
        {fieldname:"posting_date",header:"Date",fieldtype:"Date"},
        {fieldname:"pos_profile",header:"POS Profile"},
        {fieldname:"working_day",header:"Working Day #"},
        {fieldname:"shift_name",header:"Shift"},
        {fieldname:"owner",header:"Opened By"},
        {fieldname:"creation",header:"Opened Date",fieldtype:"Datetime"},
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
    {fieldname:"posting_date", fieldtype:"Date", label:t('Sale Date'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal',default:"This Month"},
    {fieldname:"pos_profile", fieldtype:"Link",options:"POS Profile", label:t('POS Profile')},
    {fieldname:"working_day", fieldtype:"Link",options:"Working Day", label:t("Working Day")},
    {fieldname:"shift_name", fieldtype:"Link",options:"Shift Type", label:t("Shift Type")},
    {fieldname:"is_closed", fieldtype:"Select",options:[{label:t("Opened"),name:0},{label:t("Closed"),name:1}], label:t("Status"),clear:true}
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/shift-detail/" + data.name, "forward", "push");
}
</script>