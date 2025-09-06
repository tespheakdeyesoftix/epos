<template>
  <div class="ion-padding">
  
    <ion-grid>
      <ion-row>
      <ion-col>

 
      <!-- today revenue -->
       <ion-card button color="primary" class="ion-no-margin">
        <ion-card-content class="text-center">
          <ion-card-subtitle style="font-size: 18px;">
            <ComCurrency :value= "data?.current_revenue || 0" />
          </ion-card-subtitle>
          <ion-card-subtitle class="mt-2" style="font-size: 18px;">
            {{ t("Today Revenue") }}
          </ion-card-subtitle>
        </ion-card-content>
      </ion-card>

      </ion-col>
      <!-- MTD Revenue -->
<ion-col>
       <ion-card button color="secondary" class="ion-no-margin">
        <ion-card-content class="text-center">
          <ion-card-subtitle style="font-size: 18px;">
            <ComCurrency :value= "data?.mtd_revenue || 0" />
          </ion-card-subtitle>
          <ion-card-subtitle class="mt-2" style="font-size: 18px;">
            {{ t("MTD Revenue") }}
          </ion-card-subtitle>
        </ion-card-content>
      </ion-card>
      </ion-col>
      <ion-col>
       <ion-card button color="success" class="ion-no-margin">
        <ion-card-content class="text-center">
          <ion-card-subtitle style="font-size: 18px;">
            <ComCurrency :value= "data?.ytd_revenue || 0" />
          </ion-card-subtitle>
          <ion-card-subtitle class="mt-2" style="font-size: 18px;">
            {{ t("YTD Revenue") }}
          </ion-card-subtitle>
        </ion-card-content>
      </ion-card>
      
     </ion-col>
    </ion-row>
    </ion-grid>

    
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref, onMounted } from 'vue'

const t = window.t;

// Reactive data object
// const data = ref<Record<string, any>>({})
const data = ref({"current_revenue":0,"mtd_revenue":0,"ytd_revenue":0})
 


async function getData() {
  const workingDay = app.setting?.working_day?.posting_date || dayjs().format("YYYY-MM-DD")
  const res = await app.getApi('epos_restaurant_2023.purchasing.doctype.vendor.vendor.get_store_revenue', {
    vendor: app.route.params.name,
    posting_date: workingDay
  })
 if(res.data){
  data.value = res.data
 } 
}


onMounted(() => {
  getData()
})
</script>
