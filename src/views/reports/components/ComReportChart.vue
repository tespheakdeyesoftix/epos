<template>
 
  <div class="px-1 mt-1">
        <div class="mt-1 bg-gray-100 border-round-lg pt-2" style="width: 100%;height: 350px;" v-if="data">
            <v-chart :option="option" autoresize />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
    data: Object,
    chartSeries:String
})
const t = window.t;

const option = computed(() => {
    if (props.data) {
        return {
            grid: {
                left: 20,
                right: 20,
                top: 40,
                bottom: 30,
                containLabel: true
            },
            legend: {
    data:  props.data.data.datasets.map(r=>r.name)
  },
            tooltip: {
                trigger: 'axis' // Shows tooltip for the whole category axis
            },
            xAxis: {
                type: 'category',
                data: props.data.data.labels
            },
            yAxis: {
                type: 'value'
            },
            series:  getChartSeries()
        }

    }
    return []

})

function getChartSeries(){
  
   let datasets =  props.data.data.datasets.map(({ values, ...rest }) => ({
  ...rest,
  data: values,
  type:props.data.type,
  label:getSeriesLabel()
}));

if(props.chartSeries){
    let chartSeries = props.chartSeries.split(",")
    datasets = datasets.filter(x=>chartSeries.includes(x.name))
}

return datasets;
}

function getSeriesLabel(){
return  {
                        show: true,
                        position: 'top', // show label above bar
                        color: '#000',   // label text color (optional)
                        fontSize: 12     // label font size (optional)
                    }
}
</script>