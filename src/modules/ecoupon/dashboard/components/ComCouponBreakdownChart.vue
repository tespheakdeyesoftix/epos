<template>
  <ion-card class="ion-no-margin ion-no-padding">
    <ion-card-header  class="ion-no-padding">
      <ion-item lines="none">
        <ion-label>
          <h1>{{ t("Sale Breakdown by Coupon Code") }}</h1>
        </ion-label>
        <!-- Desktop: Show buttons -->
        <template v-if="platform !== 'mobile'">
          <ion-button @click="onChangeChartType('bar')" shape="round" size="default"
            :fill="chartType == 'bar' ? 'solid' : 'clear'"
             v-tooltip.top="`${t('View Graph as Bar Chart')}`">
            <ion-icon slot="icon-only" :icon="barChartOutline"></ion-icon>
          </ion-button>
          <ion-button @click="onChangeChartType('line')" shape="round" size="default"
            :fill="chartType == 'line' ? 'solid' : 'clear'" v-tooltip.top="`${t('View Graph as Line Chart')}`">
            <ion-icon slot="icon-only" :icon="analyticsOutline"></ion-icon>
          </ion-button>
          <ion-chip @click="onViewData" slot="end" color="primary">
            {{ t("View Data") }}
          </ion-chip>
        </template>

        <!-- Mobile: Show hamburger icon -->
        <template v-else>
          <ion-button id="hamburger-menu-btn" fill="clear" size="default" shape="round" slot="end"  class="ion-no-margin" >
            <ion-icon slot="icon-only" :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover trigger="hamburger-menu-btn" trigger-action="click" size="auto"  :dismiss-on-select="true">
            <ion-content class="ion-padding">
              <ion-list>
                <ion-item button @click="onChangeChartType('bar')" lines="full">
                  <ion-icon slot="start" :icon="barChartOutline"></ion-icon>
                  <ion-label>{{ t("View Graph as Bar Chart") }}</ion-label>
                </ion-item>
                <ion-item button @click="onChangeChartType('line')" lines="full">
                  <ion-icon slot="start" :icon="analyticsOutline"></ion-icon>
                  <ion-label>{{ t("View Graph as Line Chart") }}</ion-label>
                </ion-item>
                <ion-item button @click="onViewData" lines="full">
                  <ion-icon slot="start" :icon="documentTextOutline"></ion-icon>
                  <ion-label>{{ t("View Data") }}</ion-label>
                </ion-item>
              </ion-list>
            </ion-content>
          </ion-popover>
        </template>
      </ion-item>
    </ion-card-header>

    <ion-card-content>
      <div class="mt-1 bg-blue-50 border-round-lg" style="width: 100%; height: 325px;" v-if="data">
        <v-chart :option="option" autoresize />
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { analyticsOutline, barChartOutline, menuOutline,ellipsisVerticalOutline, documentTextOutline } from 'ionicons/icons'
import VChart from 'vue-echarts'
import ComViewSaleBreakdownByCouponData from '@/modules/ecoupon/dashboard/components/ComViewSaleBreakdownByCouponData.vue'
 
 
 
const platform = ref(app.utils.getPlateform())


function updatePlatform() {
  platform.value = window.innerWidth <= 1024 ? 'mobile' : 'desktop'
}

onMounted(() => {
  window.addEventListener('resize', updatePlatform)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePlatform)
})

// Chart type state
const chartType = ref('bar')

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

// Translation helper
const t = window.t

// Chart option configuration
const option = computed(() => {
  const productNames = props.data.map(item => item.product_name)
  const totalAmounts = props.data.map(item => item.total_amount)
  const quantities = props.data.map(item => item.quantity)
  const couponValues = props.data.map(item => item.total_coupon_value)

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => `${params.seriesName}<br/>${params.name}: ${params.value}`
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
        type: chartType.value,
        data: totalAmounts,
        label: {
          show: true,
          position: 'top',
          formatter: params => app.currencyFormat(params.value)
        }
      },
      {
        name: t("Quantity"),
        type: chartType.value,
        data: quantities,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}'
        }
      },
      {
        name: t("Coupon Value"),
        type: chartType.value,
        data: couponValues,
        label: {
          show: true,
          position: 'top',
          formatter: params => app.currencyFormat(params.value)
        }
      }
    ]
  }
})

// Change chart type
function onChangeChartType(type = 'bar') {
  chartType.value = type
}

// Open modal for detailed data
function onViewData() {
  app.openModal({
    component: ComViewSaleBreakdownByCouponData,
    componentProps: {
      data: props.data
    }
  })
}
</script>
