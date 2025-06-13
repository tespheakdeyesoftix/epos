<template>
    <ion-page>
        <AppBar>{{ t("Close Shift") }}</AppBar>
        <ion-content > 
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
             <ion-content class="ion-padding">

      <!-- Shift Info Form -->
    <ComShiftInformation />
      <!-- Amounts Table -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Shift Summary</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row class="ion-text-center">
              <ion-col><strong>Payment Type</strong></ion-col>
              <ion-col><strong>Opening Amount</strong></ion-col>
              <ion-col><strong>System Close</strong></ion-col>
              <ion-col><strong>Close Amount</strong></ion-col>
              <ion-col><strong>Difference</strong></ion-col>
            </ion-row>
            <ion-row class="ion-text-center">
              <ion-col>Total</ion-col>
              <ion-col>$0.00</ion-col>
              <ion-col>$0.00</ion-col>
              <ion-col>$0.00</ion-col>
              <ion-col>$0.00</ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- Note Field -->
      <ion-item lines="full">
        <ion-label position="stacked">Closed Note</ion-label>
        <ion-textarea placeholder="Enter note..."></ion-textarea>
      </ion-item>
      <ion-grid class="ion-padding-top">
        <ion-row>
          <ion-col>
            <ion-button expand="block" color="danger">Cancel</ion-button>
          </ion-col>
          <ion-col>
            <ion-button expand="block" color="primary">Close Shift</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
        </ion-content>
        </ion-page>
</template>
<script setup>
import ComShiftInformation from './components/ComShiftInformation.vue';

const t = window.t;
const handleRefresh = async (event) => {
    await onRefresh()
    event.target.complete();
};

</script>