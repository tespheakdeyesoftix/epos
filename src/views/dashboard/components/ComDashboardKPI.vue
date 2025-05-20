<template>
    <div class="block mt-3">
 <ion-button id="open-modal" expand="block">Open Modal</ion-button>
     <ion-modal ref="modal" trigger="open-modal">
      <ion-content>
HIIIIIIIIIIIIIIIII
      </ion-content>
    </ion-modal>
 
    <div class="grid px-2">
      <ComCardKPI
  mainClass="bg-blue-500"
  :icon="cashOutline"
  :isCurrency="true"
  label="Total Revenue"
  :value="data?.value?.total_revenue"
/>
 
    </div>
        <div class="grid px-2" style="margin-top: 1px;">
            <ComCardKPI
  mainClass="bg-green-500"
  :icon="folderOpenOutline"
  label="Active Bill / QTY"
 :value="data?.value?.total_active_bill + ' / ' + data?.value?.total_active_quantity"
/>
      <ComCardKPI
  mainClass="bg-red-500"
  :icon="trashBinOutline"
  label="Deleted Bill / QTY"
  :value="data?.value?.totale_deleted_bill + ' / ' + data?.value?.total_deleted_quantity"
/>
    </div>
       </div>
</template>
<script setup>
import {cashOutline, folderOpenOutline, trashBinOutline} from 'ionicons/icons';
import ComCardKPI from './ComCardKPI.vue';
 import {
    IonModal,
    IonContent
  } from '@ionic/vue';
  import { ref } from 'vue';

  const modal = ref();

  const dismiss = () => modal.value.$el.dismiss();
const props = defineProps({
    data:Object
}) 
</script>