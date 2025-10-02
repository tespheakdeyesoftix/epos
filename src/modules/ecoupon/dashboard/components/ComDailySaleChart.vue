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
            
            <!-- Mobile week filter chips -->
            <div v-if="platform === 'mobile'" class="ion-padding-horizontal">
                <ion-chip @click="showThisWeek" :color="weekFilter === 'this' ? 'primary' : 'medium'">
                    {{ t("This Week") }}
                </ion-chip>
                <ion-chip @click="showLastWeek" :color="weekFilter === 'last' ? 'primary' : 'medium'">
                    {{ t("Last Week") }}
                </ion-chip>
            </div>
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
const t = window.t;
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

// Helper: aggregate data by week for mobile view
function aggregateWeeklyData(data) {
  // Initialize all 4 weeks with 0 value
  const weeklyMap = {
    'Week 1': 0,
    'Week 2': 0,
    'Week 3': 0,
    'Week 4': 0
  }
  
  data.forEach(item => {
    const day = new Date(item.day).getDate()
    const week = Math.floor((day - 1) / 7) + 1
    // Ensure week is between 1-4
    const weekNumber = Math.min(week, 4)
    const weekLabel = `Week ${weekNumber}`
    weeklyMap[weekLabel] += item.value
  })
  
  // Return all 4 weeks in order
  return [
    { day: 'Week 1', value: weeklyMap['Week 1'] },
    { day: 'Week 2', value: weeklyMap['Week 2'] },
    { day: 'Week 3', value: weeklyMap['Week 3'] },
    { day: 'Week 4', value: weeklyMap['Week 4'] }
  ]
}

const chartType = ref('line')
const weekFilter = ref('this') // default to 'this week'

const option = computed(() => {
  let chartData = props.data
  
  // For mobile, show weekly aggregated view with highlighting
  if (platform.value === 'mobile') {
    chartData = aggregateWeeklyData(props.data)
  }
  
  const days = chartData.map(item => item.day)
  const values = chartData.map(item => item.value)
  
  // For mobile, calculate which week to highlight
  let highlightWeekIndex = -1
  if (platform.value === 'mobile') {
    const currentDate = new Date()
    const currentDay = currentDate.getDate()
    const currentWeek = Math.floor((currentDay - 1) / 7) + 1
    
    if (weekFilter.value === 'this') {
      highlightWeekIndex = currentWeek - 1 // 0-indexed
    } else if (weekFilter.value === 'last') {
      const lastWeek = currentWeek > 1 ? currentWeek - 1 : 1
      highlightWeekIndex = lastWeek - 1
    }
  }
 
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.seriesName}<br/>${params.name}: ${app.currencyFormat(params.value)}`
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
        rotate: platform.value === 'mobile' ? 0 : 45
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
          position: 'top',
          formatter: function (params) {
            return app.currencyFormat(params.value)
          }
        },
        itemStyle: platform.value === 'mobile' ? {
          color: function(params) {
            // Highlight the selected week with primary color
            return params.dataIndex === highlightWeekIndex ? '#3880ff' : '#92949c'
          }
        } : {},
        emphasis: {
          itemStyle: {
            color: '#3880ff'
          }
        }
      }
    ]
  }
})

function onChangeChartType(type='bar'){
    chartType.value= type
}

function showThisWeek() {
    weekFilter.value = 'this'
}

function showLastWeek() {
    weekFilter.value = 'last'
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