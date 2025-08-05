<template>

    <BaseModal v-if="!hideOnConfirm" :hideFooter="true" @onConfirm="onSelectDate">
        <ion-datetime  style=" width: 100%;" v-model="selectedDate" ></ion-datetime>
    </BaseModal>
    <BaseModal v-else :hideFooter="true">
        <ion-datetime  style=" width: 100%;" v-model="selectedDate" @ionChange="onSelect"></ion-datetime>
    </BaseModal>

    
</template>
<script setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
import { modalController } from "@ionic/vue"
const props = defineProps({
    hideOnConfirm:{
        type:Boolean,
        default:false
    }
})

 
const selectedDate = ref(dayjs().format("YYYY-MM-DDTHH:MM:ss"))
function onSelectDate(){
    
    if(!selectedDate.value){
        app.showWarning("Please select date")
        return
    }
    modalController.dismiss(selectedDate.value, 'confirm')

}
function onSelect(){
   
    if(!selectedDate.value){
        app.showWarning("Please select date")
        return
    }
    modalController.dismiss(selectedDate.value, 'confirm')
}
</script>