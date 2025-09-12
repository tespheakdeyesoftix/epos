<template>
  <ComRecentUseCouponTable v-if="plateform === 'desktop'" :data="data" />
  <ComRecentUseCouponMobile v-else v-for="(d, index) in data" :key="index" :data="d" />
 
  <ion-button expand="full" fill="clear" routerLink="/coupon-transaction-list">
    {{ t("View all Coupon Transactions") }}
  </ion-button>
</template>

<script setup>
import ComRecentUseCouponTable from "@/modules/ecoupon/dashboard/components/recent-transaction/ComRecentUseCouponTable.vue"
import ComRecentUseCouponMobile from "@/modules/ecoupon/dashboard/components/recent-transaction/ComRecentUseCouponMobile.vue"
import { onMounted, ref } from "vue"

const t = window.t
const plateform = app.utils.getPlateform().toLowerCase()
const data = ref([])

async function getData() {
  const res = await app.getDocList("Coupon Transaction", {
    fields: ["sale", "customer","customer_name", "pos_station","creation","owner","posting_date","coupon_code" ,"coupon_number", "actual_amount", "coupon_amount"],
    filters: [
      ["business_branch", "=", app.setting.property.property_name],
      ["transaction_type", "=", "Used"]
    ],
    orderBy: {
      field: "creation",
      order: "desc"
    }
  })
  if (res.data) {
    data.value = res.data
  }
}

onMounted(async () => {
  await getData()
})
</script>
