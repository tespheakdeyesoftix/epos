<template>
    <BaseModal :title="t('Select Date')">
        <div v-if="!showDateRange" class="mb-6">
        <ion-list  >
            <ion-item v-for="(d,index) in timespans" :key="index" @click="onselectTimespan(d)" button>
                <ion-label>{{ t(d) }}</ion-label>
            </ion-item>
            
        </ion-list>
    </div>
        <template v-else>
         
<stack  gap="10px">
    <stack  gap="10px">
         <ion-select v-if="showOperator" v-model="operator" label="Operator" label-placement="floating" fill="outline">
    <ion-select-option v-for="(op, index) in operators" :key="index" :value="op.value">{{ t(op.label) }}</ion-select-option>
    
  </ion-select>
        <ComDatePicker v-model="dateRange.start_date" :placeholder="t('Start Date')" :label="t('Start Date')"/>
        <ComDatePicker v-if="operator=='between'" v-model="dateRange.end_date" :placeholder="t('End Date')" :label="t('End Date')"/>
    </stack>
    <ion-button expand="full" shape="round" size="large" @click="onSearch">Search</ion-button>
</stack>
        </template>
    </BaseModal>
</template>
<script setup>
import { ref } from 'vue';
import {  modalController } from "@ionic/vue";
 
 
import dayjs from 'dayjs';
import ComDatePicker from './ComDatePicker.vue';
const props =defineProps({
    showOperator:{
        type:Boolean,
        default:true
    }
})
const dateRange = ref({
    start_date:dayjs().toDate(),
    end_date:dayjs().toDate()
})
const model =defineModel()
const operator = ref("between")
const t = window.t;

const showDateRange = ref(false) 
const timespans=[
  "Today",
  "Yesterday",
  "Tomorrow",
  "This Week",
  "Last Week",
  "Next Week",
  "This Month",
  "Last Month",
  "Next Month",
  "This Quarter",
  "Last Quarter",
  "This Year",
  "Last Year",
  "Date Range"
]

const operators = [
    {label:"Equal",value:"="},
    {label:"Greater than",value:">"},
    {label:"Greater than and Equal",value:">="},
    {label:"Less than",value:"<"},
    {label:"Less than and Equal",value:"<="},
    {label:"Between Date",value:"between"},
]

async function onselectTimespan(timespan){
    if (timespan!='Date Range'){
     
        model.value = app.getTimespanRange(timespan)
    modalController.dismiss(  {...model.value,timespan:timespan,operator:operator.value}, 'confirm')
    }else {
        // show start  date and date picker to select 
        const modal = await modalController.getTop();
      
    if (modal) {
      modal.setCurrentBreakpoint(0.5);
    }

        showDateRange.value = true
    }
    
}
function onSearch(){
    model.value = {
        start_date:dayjs(dateRange.value.start_date).format("YYYY-MM-DD"),
        end_date:dayjs(dateRange.value.end_date).format("YYYY-MM-DD"),
        operator:operator.value
    }
    modalController.dismiss(  model.value, 'confirm')

}
</script>