<template>
    <ion-segment>
          <ion-segment-button value="About" content-id="About">
            <ion-label>About</ion-label>
          </ion-segment-button>
          <ion-segment-button value="Recent Order" content-id="Recent Order">
            <ion-label>Recent Order</ion-label>
          </ion-segment-button>
          <ion-segment-button value="Print" content-id="Print">
            <ion-label>Print</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-segment-view>
        <ion-segment-content id="About">
          <ion-grid>
        <ion-row>
          <ion-col size="6">
            <div>{{ data?.customer_group }}</div>
            <div class="mt-1"><ion-text color="medium">{{ t("Guest Type") }}</ion-text></div>
          </ion-col>
          <ion-col size="6">
            <div>{{ data?.phone_number || data?.phone_number_2 || 'null' }}</div>
            <div class="mt-1"><ion-text  color="medium">Phone Number</ion-text></div> 
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="6">
            <div>{{ data?.gender}}</div>
            <div class="mt-1"><ion-text color="medium">Gender</ion-text></div> 
          </ion-col>
          <ion-col size="6">
            <div>{{ data?.country}}</div>
            <div class="mt-1"><ion-text color="medium">Country</ion-text></div> 
          </ion-col>
        </ion-row>
        
      </ion-grid>
        </ion-segment-content>
        <ion-segment-content id="Recent Order">Recent Ordergehter</ion-segment-content>
        <ion-segment-content id="Print">Print</ion-segment-content>
      </ion-segment-view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const data = ref()
 
async function loadData() {
    const l = await app.showLoading()
    let res = await app.getDoc("Customer", app.route.params.name)
    if (res.data) {
        data.value = res.data
        
    }

   

    await l.dismiss();

}
const t = window.t;
onMounted(async () => {

    await loadData()
})
</script>