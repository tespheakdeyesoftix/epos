<template>
    <ion-card class="ion-no-margin">
        <ion-card-header>
            <ion-item lines="none">
                <ion-label>
                    <h1> {{ t("Revenue vs Coupon Used by Station") }}</h1>
                </ion-label>

                <ion-button @click="onChangeChartType('bar')" shape="round" size="default"
                    :fill="chartType == 'bar' ? 'solid' : 'clear'" v-tooltip.top="`${t('View Graph as Bar Chart')}`">
                    <ion-icon slot="icon-only" :icon="barChartOutline"></ion-icon>
                </ion-button>
                <ion-button @click="onChangeChartType('line')" shape="round" size="default"
                    :fill="chartType == 'line' ? 'solid' : 'clear'" v-tooltip.top="`${t('View Graph as Line Chart')}`">
                    <ion-icon slot="icon-only" :icon="analyticsOutline"></ion-icon>
                </ion-button>
                <ion-chip @click="onViewData" slot="end" color="primary">{{ t("View Data") }}</ion-chip>

            </ion-item>

        </ion-card-header>
        <ion-card-content>
            <div class="mt-1 border-round-lg" style="width: 100%; height: 400px;" v-if="data">
                <v-chart :option="option" autoresize />
            </div>
        </ion-card-content>
    </ion-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import ComViewCouponUseByPOSStatinData from '@/modules/ecoupon/dashboard/components/ComViewCouponUseByPOSStatinData.vue'
import { analyticsOutline, barChartOutline } from 'ionicons/icons';


const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartType=ref('bar')
const t = window.t;

const option = computed(() => {
  const labels = props.data.map(item => item.pos_station)
  const couponValues = props.data.map(item => Math.abs( item.coupon_value))
  const totalAmount = props.data.map(item =>Math.abs( item.total_amount))
 
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.seriesName}<br/>${params.name}: ${params.value}`
      }
    },
    legend: {
      data: [t("Total Revenue"),t("Coupon Value")]
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
      data: labels,
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
        name: t("Total Revenue"),
        type: chartType.value,
        data: totalAmount,
         label: {
            show: true,
            position: 'top', // or 'inside', 'bottom', etc.
            formatter: function (params) {
                return app.currencyFormat(params.value)
            }
            }
      },
      {
        name: t("Coupon Value"),
        type: chartType.value,
        data: couponValues,
         label: {
            show: true,
            position: 'top', // or 'inside', 'bottom', etc.
            formatter: function (params) {
                return app.currencyFormat(params.value)
            }
            }
      },
      
    ]
  }
})

function onChangeChartType(type='bar'){
    chartType.value= type
}


function onViewData(){
    app.openModal({
        component:ComViewCouponUseByPOSStatinData,
        componentProps:{
            data:props.data
        }
    })
}
</script>


