<template>
        
  <BaseModal :title="t('Scan Member Card')">
    <ion-text >
        <h1 style="margin-left: 20px; margin-top: 0">{{t("Please scan member card")}}</h1>
  </ion-text>   
    
    <ion-item lines="none">
    <ion-input
      fill="outline"
      placeholder="Please scan member card"
    ></ion-input>
    <ion-icon :icon="qrCodeOutline" style="margin-left:-40px" ></ion-icon>
  </ion-item>
 </BaseModal>
</template>
<script setup>
 import { IonIcon } from '@ionic/vue';
import { qrCodeOutline} from "ionicons/icons";
const t =window.t;
 import { modalController } from "@ionic/vue"
function onScanMemberCard(customer){

    modalController.dismiss(customer, 'confirm')
}
</script>

