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
const t = window.t;
const props = defineProps({
    data: Object
})
</script>