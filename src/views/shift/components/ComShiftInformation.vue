<template>
    <ion-card v-if="data">
  <ion-card-header>
    <ion-card-title> {{ t('Shift Information') }}</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    <ion-grid>
      <ion-row>
        <ion-col size="6">
          <strong>{{t('Working Day')}}:</strong><br />
          <ion-text color="medium">{{data?.working_day}}</ion-text>
        </ion-col>
        <ion-col size="6">
          <strong>{{ t('Cashier Shift') }} :</strong><br />
          <ion-text color="medium">{{ data?.name }}</ion-text>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6">
          <strong>{{t('Close Date')}}:</strong><br />
          <ion-text color="medium">{{data?.posting_date}}</ion-text>
        </ion-col>
        <ion-col size="6">
          <strong>{{$t('Shift Name')}}:</strong><br />
          <ion-text color="medium">{{data?.shift_name}}</ion-text>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <strong>{{$t('POS Profile')}} :</strong><br />
          <ion-text color="medium">{{data?.pos_profile}}</ion-text>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card-content>
</ion-card>
</template>
<script setup>
const t = window.t;
const props = defineProps({
    data:Object
})
</script>