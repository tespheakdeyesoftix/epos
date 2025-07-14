<template>
    <ion-page>
        <AppBar>{{ t("Customer List") }}</AppBar>
        <ion-content ref="contentRef">
         
            <DocList docType="Customer" :options="options"  
                :contentRef="contentRef"
                @onRowDblClick="onRowDblClick"
                v-model:selectedRow="selectedRow"
                ref="docListRef"
                
                >    
            </DocList>
        </ion-content>
       <ion-fab slot="fixed" horizontal="end" vertical="bottom">
  <ion-fab-button v-tooltip.top="t('Add new customer')" @click="onAddCustomer" >
    <ion-icon :icon="addOutline"></ion-icon>
  </ion-fab-button>
</ion-fab>
<ComFooter>
    <ion-button :disabled="!selectedRow" @click="onEdit" style="width: 5rem">{{ t("Edit") }}</ion-button>
    <ion-button color="danger" :disabled="!selectedRow" @click="onDelete" style="width: 5rem">{{ t("Delete") }}</ion-button>
</ComFooter>
    </ion-page>
</template>
<script setup>
import { ref  } from 'vue';
import { addOutline } from "ionicons/icons";
import { onIonViewWillEnter } from '@ionic/vue';
const contentRef = ref(null)
const docListRef = ref(null)
const plateform = ref(app.utils.getPlateform())
const selectedRow = ref()
const t = window.t
const options = {
   
    columns:[
        {fieldname:"customer_code_name",header:"Customer",url:"/customer-detail",id_field:"name" },
        {fieldname:"customer_name_kh",header:"Name Kh"},
        {fieldname:"gender",header:"Gender"},
        {fieldname:"customer_group",header:"Group"},
        {fieldname:"date_of_birth",header:"Date of Birth",fieldtype:"Date"},
        {fieldname:"phone_number",header:"Phone Number"},
        {fieldname:"company_name",header:"Company Name"},
        {fieldname:"address",header:"Location"},
        {fieldname:"modified",header:"Last Modified",fieldtype:"Datetime"},
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name","customer_name_en","customer_name_kh","photo","gender","company_name","address","customer_group","date_of_birth","phone_number","modified"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[["is_disabled","=",0]],

  filterOptions:[
    {fieldname:"customer_group", fieldtype:"Link",options:"Customer Group", label:t('Customer Group'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal'},
    {fieldname:"gender", fieldtype:"Select",options:['Not Set','Male',"Female"], label:t('Gender'),clear:true,modal_type:plateform=='mobile'?'sheet_modal':'modal'},
   
  ]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/customer-detail/" + data.name, "forward", "push");
}
async function onAddCustomer(){
 
    const result = await app.utils.onAddCustomer();
    if(result){
        await docListRef.value.onRefresh();
        saleDoc.value.customer = result
        await getCustomer(result)   
    
    }
}

async function onEdit(){
   const result =await app.utils.onAddCustomer(selectedRow.value.name);
     
   if(result){
        const l = await app.showLoading();
        await docListRef.value.onRefresh();
        await l.dismiss();
   }
}
async function onDelete(){
  const confirm = await app.utils.onConfirm("Delete Customer", "Are you sure you want to delete this customer?");
  if (!confirm) return;
  const l = await app.showLoading();
  const res = await app.deleteDoc("Customer", selectedRow.value.name);  
  if (res.data) {
    await docListRef.value.onRefresh();
    app.ionRouter.navigate("/customer", "back", "replace");
  }

  await l.dismiss();
}

onIonViewWillEnter(async ()=>{
   

    if(window.reloadData){
        await docListRef.value.onReloadData();
        window.reloadData = false;
    }
})

</script>
<style>
    .customer__name::part(native-span){
        justify-content: left !important;
    }
</style>