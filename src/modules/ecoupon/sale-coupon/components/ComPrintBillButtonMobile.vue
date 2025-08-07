<template>
  
<ion-button
  @click="onCancellPrintBill"
  color="danger"
  shape="round"
  expand="full"
  v-if="saleDoc.sale_status == 'Bill Requested'"
>
  
  <ion-label style="font-size: 12px;"> {{ t("Cancel Print Bill") }}</ion-label>
 
</ion-button>

  <ion-button v-if="saleDoc.sale_status!='Bill Requested'"  
    expand="full" shape="round"
  @click="openPopover($event)" style="font-size: 12px;">
    
    {{ t("Print") }}</ion-button>
  <ion-popover :dismiss-on-select="true"
   :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false">
    <ion-content class="ion-padding">
 
      <ion-list>
      <ion-item button @click="onPrintRequestBill(p)" v-for="p in printFormat" :key="p.name">
        <ion-label>{{ p.title }}</ion-label>
      </ion-item>  
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script setup>
import { ref } from 'vue'
 import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { printOutline } from 'ionicons/icons';
 

const { saleDoc,onPrintRequestBill} = useSaleCoupon()
const printFormat = ref([]);
const t = window.t

const popoverOpen = ref(false)
const event = ref(null)

function openPopover(e) {
  printFormat.value = app.setting?.print_formats?.filter(x=>x.show_in_pos==1 && x.doc_type==="Sale");

  event.value = e
  popoverOpen.value = true
}

async function onCancellPrintBill(){
const hasPermission = await app.utils.hasPermission("cancel_print_bill");
if(!hasPermission) return

let note = false;
if (app.setting.pos_config.cancel_print_bill_required_note==1){
  note = await app.utils.onOpenKeyboard({
    title: t("Cancel Print Bill"),
    storageKey:"cancel_print_bill_required_note"
  })

}
 
if(note){
  const loading = await app.showLoading();
  const saveData = JSON.parse(JSON.stringify(saleDoc.value))
  saveData.sale_products.forEach(x=>{
    x.coupons = JSON.stringify(x.coupons)
  })
  saveData.sale_status = "Submitted";
  const res =   await app.updateDoc("Sale",saleDoc.value.name,saveData)
  if(res.data){
 
    res.data.sale_products.forEach(x => {
      x.coupons = JSON.parse(x.coupons)
    });
    saleDoc.value = res.data;
    await loading.dismiss();
    app.showSuccess("Cancell print bill successully")
  }

    

}

}
</script>
