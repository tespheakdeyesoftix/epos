<template>
  <stack row equal>
    <ion-card button color="primary">
      <ion-card-content class="text-center">
        <ion-card-subtitle style="font-size: 18px;">
          {{ data?.total_visited_count ?? 0 }}
        </ion-card-subtitle>
        <ion-card-subtitle class="mt-2" style="font-size: 18px;">
          {{ t("Total Visit") }}
        </ion-card-subtitle>
      </ion-card-content>
    </ion-card>

    <ion-card button color="warning">
      <ion-card-content class="text-center">
        <ion-card-subtitle slot="end" style="font-size: 18px;">
          <ComCurrency :value="data?.voucher_actual_amount ?? 0" />
        </ion-card-subtitle>
        <ion-card-subtitle class="mt-2" style="font-size: 18px;">
          {{ t("Total Annual order") }}
        </ion-card-subtitle>
      </ion-card-content>
    </ion-card>

    <ion-card button color="success">
      <ion-card-content class="text-center">
        <ion-card-subtitle slot="end" style="font-size: 18px;">
          <ComCurrency :value="data?.total_coupon_amount ?? 0" />
        </ion-card-subtitle>
        <ion-card-subtitle class="mt-2" style="font-size: 18px;">
          {{ t("Total Order") }}
        </ion-card-subtitle>
      </ion-card-content>
    </ion-card>
  </stack>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const t = window.t
const data = ref(null)

async function getData() {
  
    const response = await app.getApi(
      'epos_restaurant_2023.selling.doctype.customer.customer.get_customer_order_summary',
      {
        
      }
    )

    if (response?.data) {
      data.value = response.data
    } else {
      console.warn('No data returned:', response)
      data.value = {}
    }
  }  


onMounted(() => {
  getData()
})
</script>
