 <template>
    <div class="px-1 mt-1">
        <ion-text color="primary" class="ion-content">
            <h2>{{ t("Payment Break Down") }}</h2>
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
                data: props.data.map(r => r.payment_type)
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: props.data.map(r => r.base_amount),
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