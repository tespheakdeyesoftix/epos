<template>
 
  <ion-button
  shape="round" expand="full" 
  @click="openPopover($event)">
    <ion-icon slot="start" :icon="printOutline" />
    {{ t("Print Bill") }}</ion-button>
  <ion-popover :dismiss-on-select="true"
   :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false">
    <ion-content class="ion-padding">
 
      <ion-list>
      <ion-item button @click="onPrintBill(p)" v-for="p in printFormat" :key="p.name">
        <ion-label>{{ p.title }}</ion-label>
      </ion-item>  
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script setup>
import { ref } from 'vue'
import { printOutline } from 'ionicons/icons';
const props = defineProps({
    name:String
})
const printFormat = ref([]);
const t = window.t

const popoverOpen = ref(false)
const event = ref(null)

function openPopover(e) {

  printFormat.value = app.setting?.print_formats?.filter(x=>x.show_in_pos==1 && x.doc_type==="Sale");
if(printFormat.value.length>1){
    event.value = e
    popoverOpen.value = true
}
  
}



async function onPrintBill(format){
    const loading = await app.showLoading();
    await app.sale.onPrintBill(props.name,format)
    await loading.dismiss()
}
 
</script>
