<template>

<div style="position: relative;">

    
      <ion-icon style="position: absolute; right: 10px;top:15px"  :icon="calendarOutline" aria-hidden="true" class="text-2xl"></ion-icon>
      <ion-input  v-bind="$attrs" 
                     ref="ionInputRef"
                    :value="displayDate"
                   readonly
                    label-placement="floating" fill="outline"
                    @click="onSelectDate"
                   >
                 
                 </ion-input>
                </div>
</template>
<script setup>
import dayjs from 'dayjs';
import {  calendarOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
 
const ionInputRef = ref(null)
const model=defineModel()
const displayDate = ref()
defineOptions({
inheritAttrs: false
})


async function onSelectDate(){
  
 const result = await app.onSelectDate({ title: "Select Date",hideOnConfirm:true });
 

 if(result){
    model.value = result;
    displayDate.value =dayjs(result).format("DD/MM/YYYY")
 }
 
 }
 onMounted(()=>{
   displayDate.value = dayjs(model.value).format("DD/MM/YYYY")
 })

</script>