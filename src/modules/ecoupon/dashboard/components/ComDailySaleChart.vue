<template>
    <ion-card class="ion-no-margin mt-3">
        <ion-card-header>
            <ion-item lines="none">
                <ion-label>
                    <h1> {{ t("Daily Sale Revenue") }}</h1>
                </ion-label>

                <template v-if="platform !== 'mobile'">
                    <ion-button @click="onChangeChartType('bar')" shape="round" size="default"
                        :fill="chartType == 'bar' ? 'solid' : 'clear'" v-tooltip.top="`${t('View Graph as Bar Chart')}`">
                        <ion-icon slot="icon-only" :icon="barChartOutline"></ion-icon>
                    </ion-button>
                    <ion-button @click="onChangeChartType('line')" shape="round" size="default"
                        :fill="chartType == 'line' ? 'solid' : 'clear'" v-tooltip.top="`${t('View Graph as Line Chart')}`">
                        <ion-icon slot="icon-only" :icon="analyticsOutline"></ion-icon>
                    </ion-button>
                    <ion-chip @click="onViewData" slot="end" color="primary">{{ t("View Data") }}</ion-chip>
                </template>

                <template v-else>
                    <ion-button id="menu" fill="clear" size="large" >
                        <ion-icon slot="icon-only" :icon="ellipsisVerticalOutline"></ion-icon>
                    </ion-button>

                    <ion-popover trigger="menu" trigger-action="click" size="auto"  :dismiss-on-select="true">
                        <ion-content class="ion-padding">
                            <ion-list>
                                <ion-item button @click="onChangeChartType('bar')">
                                    <ion-icon slot="start" :icon="barChartOutline"></ion-icon>
                                    <ion-label>{{ t("View Graph as Bar Chart") }}</ion-label>
                                </ion-item> 
                                <ion-item button @click="onChangeChartType('line')">
                                    <ion-icon slot="start" :icon="analyticsOutline"></ion-icon>
                                    <ion-label>{{ t("View Graph as Line Chart") }}</ion-label>
                                </ion-item>
                                <ion-item button @click="onViewData">
                                    <ion-label>{{ t("View Data") }}</ion-label>
                                </ion-item>
                            </ion-list>
                        </ion-content>
                    </ion-popover>
                </template>
            </ion-item>

        </ion-card-header>
        <ion-card-content>
            <div class="mt-1 border-round-lg" style="width: 100%; height: 323px;" v-if="data">
                <v-chart :option="option" autoresize />
            </div>
        </ion-card-content>
    </ion-card>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import VChart from 'vue-echarts'
import ComViewDailySaleRevenueData from '@/modules/ecoupon/dashboard/components/ComViewDailySaleRevenueData.vue'
import { analyticsOutline, barChartOutline, menuOutline,ellipsisVerticalOutline } from 'ionicons/icons';
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

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartType=ref('line')
const t = window.t;

const option = computed(() => {
  const days = props.data.map(item => item.day)
  const values = props.data.map(item => item.value)
 
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.seriesName}<br/>${params.name}: ${params.value}`
      }
    },
    legend: {
      data: [t("Sale Revenue")]
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
      data: days,
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
        name: t("Sale Revenue"),
        type: chartType.value,
        data: values,
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
        component:ComViewDailySaleRevenueData,
        componentProps:{
            data:props.data
        }
    })
}
</script>


