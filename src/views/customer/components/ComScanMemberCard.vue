<template>
  <BaseModal :title="t('Scan Member Card')">
    <ion-text>
      <h1 style="margin-left: 20px; margin-top: 0">{{ t("Please scan member card") }}</h1>
    </ion-text>

    <ion-item lines="none">
      <com-input 
        ref="txtMemberCard"
        @ionChange="onScanMemberCard(customer)"
        :placeholder="t('Please scan member card')"
        v-model="customer"
        focus
      ></com-input>
      <ion-icon :icon="qrCodeOutline" style="margin-left:-40px"></ion-icon>
    </ion-item>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import { IonIcon, modalController } from "@ionic/vue";
import { qrCodeOutline } from "ionicons/icons";
 const txtMemberCard  = ref(null)

const t = window.t;
const customer = ref();

async function onScanMemberCard(customer) {
   if (!customer || customer.trim() === "") {
    app.showWarning(`Customer is required.`)
  return; 
}
    const res = await app.getDocList("Customer", { filters: [["name", "=", customer],["is_disabled", "=", 0]] });
    

    if (res.data.length > 0) {
      modalController.dismiss(customer, "confirm");
    } else {
        app.showWarning(`Member ship card ${customer} not found`)
        txtMemberCard.value.focus();
        
    }


  
}
</script>
 