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
          <ion-text color="medium">{{shift?.working_day}}</ion-text>
        </ion-col>
        <ion-col size="6">
          <strong>{{ t('Cashier Shift') }} :</strong><br />
          <ion-text color="medium">{{ shift?.name }}</ion-text>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6">
          <strong>{{t('Close Date')}}:</strong><br />
          <ion-text color="medium">{{shift?.posting_date}}</ion-text>
        </ion-col>
        <ion-col size="6">
          <strong>{{$t('Shift Name')}}:</strong><br />
          <ion-text color="medium">{{shift?.shift_name}}</ion-text>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <strong>POS Profile:</strong><br />
          <ion-text color="medium">{{shift?.pos_profile}}</ion-text>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card-content>
</ion-card>
</template>
<script setup>
const t = window.t;
import { onMounted, ref, computed } from 'vue';
const shift = ref()
onMounted(async () => {
 shift.value = (await app.postApi("epos_restaurant_2023.api.api.get_current_cashier_shift",{
        pos_profile: "Main POS Profile"
 })).data
});
</script>