<template>
  
   <ion-segment @ionChange="onSegmentChange">
    <ion-segment-button value="About" content-id="About">
      <ion-label>{{ t("About") }}</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Store Payment History" content-id="Store Payment History">
      <ion-label>{{ t("Store Payment History") }}</ion-label>
    </ion-segment-button>
  </ion-segment>
 
  <ion-segment-view class="segment-view">
    <ion-segment-content id="About" class="ion-padding">
   <div class="flex-grid p-0" >
        <div class="flex-item">
          <div class="field-value">{{ data?.name || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Vendor") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.vendor_name || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Vendor Name") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.vendor_group || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Vendor Group") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.company || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Company") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
            <div class="field-value">
                <ComCurrency :value="data?.store_payment_balance || 0" />
            </div>
            <div class="mt-1">
                <ion-text color="medium">{{ t("Total Credit Amount") }}</ion-text>
            </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.phone_number || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Phone Number") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.contact_name || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Contact Name") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.email_address || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Email Address") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.province || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Province") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.address || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Address") }}</ion-text>
          </div>
        </div>
        
        <div class="flex-item">
          <div class="field-value">
             <span v-tooltip="dayjs(data?.modified).format('ddd, DD MM YYYY HH:mm A')">
            {{ dayjs(data?.modified).fromNow() }}</span>  
          </div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Last Modified") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">
             {{ data?.modified_by || '' }}     
          </div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Modified By") }}</ion-text>
          </div>
        </div>
        <div class="flex-item">
          <div class="field-value">{{ data?.note || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Note") }}</ion-text>
          </div>
        </div>

      </div>   
    </ion-segment-content>

    <ion-segment-content id="Store Payment History">
      <ComStorepaymentHistory v-if="isStorepaymentHistoryLoaded" :vendor="data.name"/>
    </ion-segment-content>
  </ion-segment-view>

</template>

<script setup>
import {  ref } from 'vue';
import dayjs from 'dayjs';
 
import ComStorepaymentHistory from '@/modules/ecoupon/store/components/ComStorepaymentHistory.vue'
const props = defineProps({
  data:Object
})
 
const t = window.t;
const isStorepaymentHistoryLoaded = ref(false)
 
 
function onSegmentChange(event){
  if(event.detail.value=="Store Payment History"){
    isStorepaymentHistoryLoaded.value = true
  }
}
</script>

<style scoped>
.segment-view {
  overflow-y: auto;
}

.mt-1 {
  margin-top: 4px;
}

.flex-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px;
}

.flex-item {
  flex: 1 1 45%;
  min-width: 140px;
  max-width: 48%;
  padding: 5px;
}

.field-value {
  font-weight: 500;
  font-size: 16px;
}
</style>
