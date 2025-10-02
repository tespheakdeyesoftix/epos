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
                                    <ion-icon slot="start" :icon="documentTextOutline"></ion-icon>
                                    <ion-label>{{ t("View Data") }}</ion-label>
                                </ion-item>
                            </ion-list>
                        </ion-content>
                    </ion-popover>
                </template>
            </ion-item>
            
            <!-- Mobile day filter chips -->
           

            <div v-if="platform === 'mobile'" class="ion-padding-horizontal">
                <ion-chip  v-for="d in weekDate" :color="d.title==selectedWeekDate.title?'primary':''" @click="onWeekSelect(d)">
                    {{ t(d.title) }}
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
import { analyticsOutline,documentTextOutline, barChartOutline, menuOutline, ellipsisVerticalOutline } from 'ionicons/icons';
import dayjs from 'dayjs';
const t = window.t;
const platform = ref(app.utils.getPlateform())
const weekDate = ref(app.utils.getThisWeekAndLastWeekDate())
const selectedWeekDate = ref(weekDate.value.find(x=>x.title =="This Week"))

 


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

 

const chartType = ref('bar')
 
const option = computed(() => {
 
  let chartData = props.data
  
 
  
  let days = chartData.map(item => item.date)
  let values = chartData.map(item => item.value)
  
 
  if(platform.value =="mobile"){
    days = chartData.filter(x=>dayjs(x.date)>= selectedWeekDate.value.start && dayjs(x.date)<=selectedWeekDate.value.end).map(item => item.date)
    values =  chartData.filter(x=>dayjs(x.date)>= selectedWeekDate.value.start && dayjs(x.date)<=selectedWeekDate.value.end).map(item => item.value)
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
        
         formatter: function(value) {
          // Convert the value to day name
          return  platform.value === 'mobile'?t(dayjs(value).format('ddd')):t(dayjs(value).format('DD'));
        }
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
    chartType.value = type
}

function onWeekSelect(data) {

    selectedWeekDate.value = data;
}


function onViewData(){
    app.openModal({
        component: ComViewDailySaleRevenueData,
        componentProps: {
            data: props.data
        }
    })
}
</script>