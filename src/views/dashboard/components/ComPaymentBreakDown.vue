 <template>
    <ion-card class="ion-no-margin">
        <ion-card-header>
            <ion-item lines="none">
                <ion-label>
                    <h1> {{ t("Payment Breakdown") }}</h1>
                </ion-label>

                <template v-if="platform !== 'mobile'">

                        <ion-button @click="onChangeChartType('bar')" shape="round" size="default"
                            :fill="chartType == 'bar' ? 'solid' : 'clear'" v-tooltip.top="`${t('View Graph as Bar Chart')}`">
                            <ion-icon slot="icon-only" :icon="barChartOutline"></ion-icon>
                        </ion-button>
                        <ion-button @click="onChangeChartType('pie')" shape="round" size="default"
                            :fill="chartType == 'pie' ? 'solid' : 'clear'" v-tooltip.top="`${t('View Graph as Line Chart')}`">
                            <ion-icon slot="icon-only" :icon="pieChartOutline"></ion-icon>
                        </ion-button>
                        <ion-chip @click="onViewData" slot="end" color="primary">{{ t("View Data") }}</ion-chip>
                </template>

                <template v-else>
                    <ion-button id="hamburger-menu" fill="clear" size="large" >
                        <ion-icon slot="icon-only" :icon="ellipsisVerticalOutline"></ion-icon>
                    </ion-button>

                    <ion-popover trigger="hamburger-menu" trigger-action="click" size="auto"  :dismiss-on-select="true">
                        <ion-content class="ion-padding">
                            <ion-list>
                                <ion-item button @click="onChangeChartType('bar')">
                                    <ion-icon slot="start" :icon="barChartOutline"></ion-icon>
                                    <ion-label>{{ t("View Graph as Bar Chart") }}</ion-label>
                                </ion-item>
                                <ion-item button @click="onChangeChartType('pie')">
                                    <ion-icon slot="start" :icon="pieChartOutline"></ion-icon>
                                    <ion-label>{{ t("View Graph as Pie Chart") }}</ion-label>
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
             <div class="mt-1 bg-blue-50 border-round-lg " style="width: 100%;height: 400px;" v-if="data">
            <v-chart :option="chartType=='pie'?option:barChartOption" autoresize />
        </div>
        </ion-card-content>
    </ion-card>
     
</template>

<script setup>
import {  barChartOutline, pieChartOutline, menuOutline,ellipsisVerticalOutline } from 'ionicons/icons';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import  ComViewPaymentBreakdownData from '@/views/dashboard/components/ComViewPaymentBreakdownData.vue'
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
    data: Object
})
const chartType = ref("pie")
const option = computed(() => {
    if (props.data) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
           legend: {
                orient: 'horizontal',
                bottom:5,
                left:5,
                textStyle: {
                    fontSize: 12,
                },
                formatter: function (name) {
                    const item = props.data.find(r => r.payment_type === name);
                    if (!item) return name;
                    return `${name}\n$${item.base_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
                }
            },
            series: [
                {
                    name: t("Payment Type"),
                    type: chartType.value,
                    radius: ['0%', '70%'],
                    center: ['50%', '38%'],
                    data: props.data.map(r => ({
                        name: r.payment_type,
                        value: r.base_amount
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        show:false,
                        formatter:function (params) {
                            return  params.name + ": "  + getInputAmount( params.name)
                        }
                    }
                }
            ]
        }
    }
    return {}
})


const barChartOption = computed(()=>{
       if (props.data) {
return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.seriesName}<br/>${params.name}: ${params.value}`
      }
    },
    legend: {
      data: [t("Payment Breakdown")]
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
      data: props.data.map(x=>x.payment_type),
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
        data: props.data.map(x=>x.base_amount),
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
}
return {}

})

function getInputAmount(payment_type){
    return  props.data.find(x=>x.payment_type == payment_type).input_amount
}

function onChangeChartType(type){
    chartType.value  = type
}

function onViewData(){
    app.openModal({
        component:ComViewPaymentBreakdownData,
        componentProps:{
            data:props.data
        }
    })
}
</script>
