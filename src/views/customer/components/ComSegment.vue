<template>
   <ion-segment @ionChange="onSegmentChange">
    <ion-segment-button value="About" content-id="About">
      <ion-label>{{ t("About") }}</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Recent Order" content-id="Recent Order">
      <ion-label>{{ t("Recent Order") }}</ion-label>
    </ion-segment-button>
  </ion-segment>

  <ion-segment-view class="segment-view">
    <ion-segment-content id="About" class="ion-padding">
     


   <div class="flex-grid p-0" >

        <div class="flex-item">
          <div class="field-value">{{ data?.name || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Customer") }}</ion-text>
          </div>
        </div>

        <div class="flex-item">
          <div class="field-value">{{ data?.customer_name_kh || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Name Kh") }}</ion-text>
          </div>
        </div>

        <div class="flex-item">
          <div class="field-value">{{ data?.gender || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Gender") }}</ion-text>
          </div>
        </div>

        <div class="flex-item">
          <div class="field-value">{{ data?.customer_group || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Group") }}</ion-text>
          </div>
        </div>

        <div class="flex-item">
          <div class="field-value">
            {{ data?.date_of_birth ? dayjs(data.date_of_birth).format('DD-MM-YYYY') : '' }}
          </div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Date of Birth") }}</ion-text>
          </div>
        </div>

        <div class="flex-item">
          <div class="field-value">{{ data?.phone_number || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Phone Number") }}</ion-text>
          </div>
        </div>

        <div class="flex-item">
          <div class="field-value">{{ data?.company_name || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Company Name") }}</ion-text>
          </div>
        </div>

        <div class="flex-item">
          <div class="field-value">{{ data?.address || '' }}</div>
          <div class="mt-1">
            <ion-text color="medium">{{ t("Location") }}</ion-text>
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

      </div>   
    </ion-segment-content>

    <ion-segment-content id="Recent Order">
      <ComCustomerRecentOrder v-if="isRecentOrderLoaded" :customer="data.name"/>
    </ion-segment-content>
  </ion-segment-view>
 
</template>

<script setup>
import {  ref } from 'vue';
import dayjs from 'dayjs';
import ComCustomerRecentOrder from "@/views/customer/components/ComCustomerRecentOrder.vue"
const props = defineProps({
  data:Object
})
 
const t = window.t;
const isRecentOrderLoaded = ref(false)
 
 
function onSegmentChange(event){
  if(event.detail.value=="Recent Order"){
    isRecentOrderLoaded.value = true
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
