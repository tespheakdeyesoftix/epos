<template>
  <ion-card class="ion-no-margin ion-no-padding">
    <ion-card-header>
      <ion-card-title>
        {{ t("Sale Breakdown by Coupon Code") }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div class="mt-1 bg-blue-50 border-round-lg" style="width: 100%; height: 323px;" v-if="data">
        <v-chart :option="option" autoresize />
      </div>

    
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const t = window.t;

const option = computed(() => {
  const productNames = props.data.map(item => item.product_name)
  const totalAmounts = props.data.map(item => item.total_amount)
  const quantities = props.data.map(item => item.quantity)
  const couponValues = props.data.map(item => item.total_coupon_value)

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.seriesName}<br/>${params.name}: ${params.value}`
      }
    },
    legend: {
      data: [t("Total Amount"), t("Quantity"), t("Coupon Value")]
    },
     grid: {
    top: 25,
    bottom: 5,
    left: 40,
    right: 10,
    containLabel: true
  },
    xAxis: {
      type: 'category',
      data: productNames,
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: t("Total Amount"),
        type: 'bar',
        data: totalAmounts
      },
      {
        name: t("Quantity"),
        type: 'bar',
        data: quantities
      },
      {
        name: t("Coupon Value"),
        type: 'bar',
        data: couponValues
      }
    ]
  }
})
</script>


