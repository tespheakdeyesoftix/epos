<template>
  <BaseModal :title="t('Scan Member Card')">
    <ion-text>
      <h1 style="margin-left: 20px; margin-top: 0">{{ t("Please scan member card") }}</h1>
    </ion-text>

    <ion-item lines="none">
      <com-input
        @ionChange="sale(customer)"
        placeholder="Please scan member card"
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

const t = window.t;
const customer = ref();

async function sale(customer) {
  try {
    const res = (await app.getDoc("Customer", customer)).data;

    if (res) {
      console.log("Customer found:", res);
      modalController.dismiss(customer, "confirm");
    } else {
      console.warn("Customer not found, modal stays open.");
      // Optionally show a warning to the user
    }
  } catch (error) {
    console.error("Error fetching customer:", error);
    // Keep modal open
  }
}
</script>

<style scoped>

</style>
