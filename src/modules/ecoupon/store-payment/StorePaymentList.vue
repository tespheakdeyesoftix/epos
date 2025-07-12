<template>
    <ion-page>
        <AppBar>{{ t("Store Payment List") }}</AppBar>
        <ion-content ref="contentRef">
            <DocList docType="Store Payment" :options="options"
            v-model:selectedRow="selectedRow"
            @onRowDblClick="onRowDblClick"
            :contentRef="contentRef"
            ref="docListRef"
            
            >
                
                <template v-if="plateform == 'mobile'" v-slot:default="{ item }">
                    <ComTopUpCard v-for="(d,index) in item" :key="index"  :data="d"/>
                </template>
            </DocList>
        </ion-content>
        <ion-fab slot="fixed" horizontal="end" vertical="bottom">
            <ion-fab-button v-tooltip.top="t('Add new Store Payment')" @click="onStorePayment" >
                <ion-icon :icon="addOutline"></ion-icon>
            </ion-fab-button>
        </ion-fab>
        <ComFooter>
            <ion-button :disabled="!selectedRow" @click="onEdit">{{ t("Edit") }}</ion-button>
            <ion-button color="danger" :disabled="!selectedRow" @click="onDelete">{{ t("Delete") }}</ion-button>
        </ComFooter>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import ComTopUpCard from '@/modules/ecoupon/TopUpList/components/ComTopUpCard.vue';
import { addOutline } from "ionicons/icons";
 const contentRef = ref(null)
 const docListRef = ref(null)
 const selectedRow = ref()
const plateform = ref(app.utils.getPlateform())

const t = window.t
const options = {
    columns:[
        {fieldname:"name",header:"Sale #",url:"/store-payment-detail",id_field:"name"},
        {fieldname:"pos_profile",header:"POS Profile"},
        {fieldname:"posting_date",header:"Date",fieldtype:"Date"},
        // {fieldname:"working_day",header:"Working Day",fieldtype:"Date"},
        {fieldname:"cashier_shift",header:"Cashier Shift"},
        {fieldname:"vendor_name",header:"Vendor"},
        {fieldname:"payment_amount",header:"Payment Amount", fieldtype:"Currency"},
        {fieldname:"payment_types",header:"Payment Type",},
        {fieldname:"payment_types",header:"Status",},
         
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name", "pos_profile","posting_date", "working_day","cashier_shift","vendor","payment_amount","payment_types"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[],

  filterOptions:[
    {fieldname:"posting_date", fieldtype:"Date", label:t('Date'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal'},
    {fieldname:"pos_profile", fieldtype:"Link",options:"POS Profile", label:t('POS Profile')},
    {fieldname:"working_day", fieldtype:"Link",options:"Working Day", label:t("Working Day")},
    {fieldname:"cashier_shift", fieldtype:"Link",options:"Cashier Shift", label:t("Cashier Shift")},
  ],
//     noRecordActions:[
//    {title:t("Create New Redeem"),router_link:"/redeem","color":"primary"},
// ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/store-payment-detail/" + data.name, "forward", "push");
}

async function onStorePayment(){
  
    const result = await app.utils.onStorePayment();
    if (result) {
        await docListRef.value.onRefresh();
        // saleDoc.value.store_payment = result;
        
        // await getStorePayment(result);
    }
}

async function onEdit(){
   const result =await app.utils.onStorePayment(selectedRow.value.name);
     
   if(result){
        const l = await app.showLoading();
        await docListRef.value.onRefresh();
        await l.dismiss();
   }
}

async function onDelete(){
  const confirm = await app.utils.onConfirm("Delete Store Payment", "Are you sure you want to delete this Store Payment?");
  if (!confirm) return;
  const l = await app.showLoading();
  const res = await app.deleteDoc("Store Payment", selectedRow.value.name);  
  if (res.data) {
    await docListRef.value.onRefresh();
    // app.ionRouter.navigate("/store-payment-list", "back", "replace");
  }

  await l.dismiss();
}
</script>