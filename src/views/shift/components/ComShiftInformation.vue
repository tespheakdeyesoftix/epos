<template>
    <ion-card>
  <ion-card-header>
    <ion-card-title> {{ t('Shift Information') }}</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    <ion-grid>
      <ion-row>
        <ion-col size="6">
          <strong>{{t('Working Day')}}:</strong><br />
          <ion-text color="medium">WD2025-0015</ion-text>
        </ion-col>
        <ion-col size="6">
          <strong>{{ t('Cashier Shift') }} :</strong><br />
          <ion-text color="medium">CS-POS-2025-0025</ion-text>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6">
          <strong>{{t('Close Date')}}:</strong><br />
          <ion-text color="medium">13-06-2025</ion-text>
        </ion-col>
        <ion-col size="6">
          <strong>{{$t('Shift Name')}}:</strong><br />
          <ion-text color="medium">Morning Shift</ion-text>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <strong>POS Profile:</strong><br />
          <ion-text color="medium">Main POS Profile</ion-text>
        </ion-col>
      </ion-row>
    </ion-grid>
    {{ res }}
  </ion-card-content>
</ion-card>
</template>
<script setup>
const t = window.t;
import { onMounted, ref, computed } from 'vue';
const doc = ref()
const res = ref()

onMounted(async () => {
 doc.value = (await app.getDoc("POS Profile", "Main POS Profile"));
 res.value = await app.postApi("epos_restaurant_2023.api.api.get_current_cashier_shift",{
    param: {
        pos_profile: "Main POS Profile"
    }
 })
});
</script>