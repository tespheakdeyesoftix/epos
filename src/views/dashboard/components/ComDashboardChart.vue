<template>
    <div class="px-1 mt-1">
        <span>
            
            <strong>Daily Sale Chart</strong> </span>
    <div class="mt-1 bg-green-100 border-round-lg " style="width: 100%;height: 350px;" v-if="data">
        <v-chart :option="option" autoresize />
    </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
    data: Object
})

const option = computed(() => {

    if (props.data.value) {
        return {
            grid: {
                left: 20,
                right: 20,
                top: 40,
                bottom: 30,
                containLabel: true
            },
            tooltip: {
                trigger: 'axis' // Shows tooltip for the whole category axis
            },
            xAxis: {
                type: 'category',
                data: props.data.value.map(r => r.day)
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: props.data.value.map(r => r.value),
                    type: 'bar',
                  
                    barWidth: '60%',
    label: {
      show: true,
      position: 'top', // show label above bar
      color: '#000',   // label text color (optional)
      fontSize: 12     // label font size (optional)
    }
                }
            ]
        }

    }
    return []

})


</script>