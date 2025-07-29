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

            <template #docstatus="{item}">
                 
                <ComStatus :status="getStatusText(item.docstatus)"/>
            </template>

            </DocList>
        </ion-content>
        <ion-fab slot="fixed" horizontal="end" vertical="bottom">
            <ion-fab-button v-tooltip.top="t('Add new Store Payment')" @click="onAddStorePayment" >
                <ion-icon :icon="addOutline"></ion-icon>
            </ion-fab-button>
        </ion-fab>
        <ComFooter class="ion-hide-md-down">
            <ion-button :disabled="!selectedRow" @click="onEdit" >{{ t("Edit") }}</ion-button>
            <ion-button :disabled="!selectedRow" @click="onPrint" >{{ t("Print Bill") }}</ion-button>
            <ion-button color="danger" :disabled="!selectedRow" @click="onDelete">{{ t("Delete") }}</ion-button>     
        </ComFooter>
    </ion-page>
</template>
<script setup>
import { ref } from 'vue';
import ComAddPayment from "@/modules/ecoupon/store-payment/ComAddPayment.vue"; 
import { addOutline } from "ionicons/icons";
 const contentRef = ref(null)
 const docListRef = ref(null)
 const selectedRow = ref()
 import { onIonViewWillEnter } from '@ionic/vue';
const plateform = ref(app.utils.getPlateform())


const t = window.t
const options = {
    columns:[
        {fieldname:"name",header:"Sale #",url:"/store-payment-detail",id_field:"name"},
        {fieldname:"pos_profile",header:"POS Profile"},
        {fieldname:"posting_date",header:"Date",fieldtype:"Date"},
        // {fieldname:"working_day",header:"Working Day",fieldtype:"Date"},
        {fieldname:"cashier_shift",header:"Cashier Shift"},
        {fieldname:"vendor_name",header:"Vendor",url:"/store-detail",id_field:"vendor"},
        {fieldname:"payment_amount",header:"Payment Amount", fieldtype:"Currency"},
        {fieldname:"payment_types",header:"Payment Type",},
        {fieldname:"receive_by",header:"Receive By",},
        {fieldname:"receive_by_phone_number",header:"Receive By Phone Number",},
        {fieldname:"modified_by",header:"By"},
        {fieldname:"modified",header:"Last Modified",fieldtype:"Datetime"},
        {fieldname:"docstatus",header:"Status",},
         
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name", "pos_profile","posting_date", "working_day","cashier_shift","receive_by","receive_by_phone_number","vendor","vendor_name","payment_amount","payment_types"],
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


async function onPrint(){
    const printer_name = await app.storageService.getItem("default_printer") || ""
   app.printing.onPrint({doctype:"Store Payment",docname:selectedRow.value.name, template:"Store Payment Receipt",printer_name:printer_name,show_loading:true})
   
}

function getStatusText(id){
    return app.utils.getDocStatusText(id);
}


function onRowDblClick(data){
    app.ionRouter.navigate("/store-payment-detail/" + data.name, "forward", "push");
}

async function onAddStorePayment(){
   
    
    if( !app.setting.cashier_shift?.name){
        app.ionRouter.navigate("/message/No Shift Opened?&return_url=store-payment-list","forward","push")
        return;
    }
    
    const modal = await app.openModal({

    component: ComAddPayment,
    componentProps:{
      
        docListRef:docListRef
    },
    cssClass:"store-payment-modal"
  })
}

onIonViewWillEnter(async ()=>{
   

    if(window.reloadData){
        await docListRef.value.onReloadData();
        window.reloadData = false;
    }
})

async function onEdit(){
   
      const modal = await app.openModal({

    component: ComAddPayment,
    componentProps:{
        docname:selectedRow.value.name,
        docListRef:docListRef
    },
    cssClass:"store-payment-modal"
  })

 
}

async function onDelete(){
  const confirm = await app.utils.onConfirm("Delete Store Payment", "Are you sure you want to delete this Store Payment?",{background:"danger"});
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