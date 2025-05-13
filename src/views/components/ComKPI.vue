<template>
   
  <ion-card class="ion-text-center ion-no-margin" color="primary" button @click="openUrl">
    <ion-card-header>
      <ion-card-title class="text-xl font-bold"><slot></slot></ion-card-title>
      <ion-card-subtitle class="text-gray-500">{{ t(label) }}</ion-card-subtitle>
    </ion-card-header>
  </ion-card>  





</template>
<script lang="ts" setup>
      import {  IonRippleEffect ,IonText,useIonRouter } from '@ionic/vue';
      import { useI18n } from 'vue-i18n';
 
const { t} = useI18n();
      const ionRouter = useIonRouter();
      const props = defineProps({
        label:String,
        url:String,
      
      })

      function openUrl(){
        if(props.url){
          ionRouter.navigate(props.url , 'forward', 'push');
        }
        
      }
</script>
 

 