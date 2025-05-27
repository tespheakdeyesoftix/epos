 <template>
    <div class="px-1 mt-1">
        <ion-text color="primary" class="ion-content">
            <h2>{{ t("Payment Breakdown") }}</h2>
        </ion-text>
        <div class="mt-1 bg-blue-100 border-round-lg " style="width: 100%;height: 300px;" v-if="data">
            <v-chart :option="option" autoresize />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const t = window.t;

const props = defineProps({
    data: Object
})

const option = computed(() => {
    if (props.data) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: 0,
                left: 'center'
            },
            series: [
                {
                    name: t("Payment Type"),
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '50%'],
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
                        formatter: '{b}: {d}%'
                    }
                }
            ]
        }
    }
    return {}
})
</script>
