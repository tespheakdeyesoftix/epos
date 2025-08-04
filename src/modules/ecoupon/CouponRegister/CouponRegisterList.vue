<template>
    <ion-page>
        <AppBar>{{ t('Coupon Register List') }}</AppBar>
        <ion-content ref="contentRef">
            <DocList docType="Coupon Register" :options="options"  
                :contentRef="contentRef"
                @onRowDblClick="onRowDblClick"
                v-model:selectedRow="selectedRow"
                ref="docListRef"
                >    
                <template #docstatus="{item}">
                 
                <ComStatus :status="getStatusText(item.docstatus)"/>
            </template>
            </DocList>
        </ion-content>
        <ion-fab slot="fixed" horizontal="end" vertical="bottom">
            <ion-fab-button v-tooltip.top="t('Add Coupon Register')" @click="onAddCouponRegister" >
                <ion-icon :icon="addOutline"></ion-icon>
            </ion-fab-button>
        </ion-fab>
    </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { addOutline } from "ionicons/icons";
import ComAddCouponRegister from "@/modules/ecoupon/CouponRegister/components/ComAddCouponRegister.vue"
function getStatusText(id){
    return app.utils.getDocStatusText(id);
}
 const t = window.t
const selectedRow = ref()
const contentRef = ref(null)
const docListRef = ref()
const options = {
   
    columns:[
        {fieldname:"name",header:"Name",url:"/coupon-register",id_field:"name" },
        {fieldname:"total_coupons",header:"Total Coupons"},   
        {fieldname:"posting_date",header:"Date",fieldtype:"Date"},
        {fieldname:"modified_by",header:"User"},
        {fieldname:"modified",header:"Last Modified",fieldtype:"Datetime"},
        {fieldname:"docstatus",header:"Status"},
    ],
    showSearchBar:true,
    showBarcodeScanner:false,
    fields: ["name","modified","total_coupons","posting_date","modified_by"],
    orderBy:{
      field: "modified",
      order: "desc",
  },
  filters:[],

  filterOptions:[]
}

function onRowDblClick(data){
    app.ionRouter.navigate("/coupon-register/" + data.name, "forward", "push");
}

async function onAddCouponRegister() {
    const result = await app.openModal({
        component: ComAddCouponRegister,
        componentProps:{
            docListRef:docListRef
        },
        cssClass:"coupon-register-modal"
    })
    
}
</script>

<style scoped>
/* this is style */
</style>

