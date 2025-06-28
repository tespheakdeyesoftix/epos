<template>
    <div class="px-1 mt-1">
        <ion-text color="primary" class="ion-content">
            <h2>{{ t("Daily Sale Chart") }}</h2>
        </ion-text>
        <div class="mt-1 bg-blue-100 border-round-lg " style="width: 100%;height: 300px;" v-if="data">
            <v-chart :option="option" autoresize />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
    data: Object
})
const t = window.t;
const option = computed(() => {

  

  if (props.data && props.data.length) {
     const current = app.utils.getWeekStartAndEnd()
             const formatDate = d => d.toISOString().split('T')[0];

            const data = props.data.filter(item => {
                const itemDate = formatDate(new Date(item.date));
                return itemDate >= current["start"] && itemDate <= current["end"];
            });
          

    return {
      grid: {
        left: 10,
        right: 30,
        top: 20,
        bottom: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
        formatter: value => {
        return `$${value}`;
        }
  }
      },
      yAxis: {
        type: 'category',
        data: data.map(r => r.day),
      },
      series: [
        {
          type: 'bar',
          data: data.map(r => r.value),
          barWidth: '45%',
          label: {
            show: true,
            position: 'top',
            color: '#000',
            fontSize: 12,
            formatter: params => (params.value === 0 ? '' : `$${params.value}`)
          },
        },
      ],
    };
  }

  // Return an empty chart option object instead of an array
  return {};
});


</script>