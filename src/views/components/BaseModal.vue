<!-- src/components/BaseModal.vue -->
<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss" size="large">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ t(title) }}</ion-title>
        <ion-buttons slot="end">
          <ion-button size="large" shape="round" @click="onConfirm" v-if="showConfirm">
            <ion-icon :icon="checkmarkOutline" />
            {{ t(confirmText) }}
          </ion-button>
          
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  
    <ion-content class="ion-padding">
      <slot />
    </ion-content>
    <ion-footer v-if="!hideFooter"> 
  <ion-toolbar>
   
    <ion-buttons slot="end">
      <ion-button size="large" fill="solid" shape="round" color="primary" @click="onConfirm">
        {{ t("Select") }}
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-footer>
  </template>
  
  <script setup>
  import {getCurrentInstance,ref,onMounted} from "vue"
  import { modalController } from '@ionic/vue';
  import { closeOutline ,checkmarkOutline} from 'ionicons/icons';

const props = defineProps({
  title: { type: String, default: 'Modal' },
  confirmText:{
    type:String,
    default:"Select"
  },
  modalRef: Object,  
  hideFooter:{
    type:Boolean,
    default:true
  }
});


const emit =  defineEmits(['onConfirm'])
const t = window.t

const showConfirm = ref(true)

function dismiss() {
  emit("dismiss")
  modalController.dismiss();
}

function onConfirm(){
  emit("onConfirm")

}

onMounted(()=>{
  const instance = getCurrentInstance()
  showConfirm.value = !!instance?.vnode?.props?.onOnConfirm
 
})

  </script>
  