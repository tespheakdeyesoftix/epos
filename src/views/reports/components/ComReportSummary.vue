<template>
    <div class="grid-scroll-container">
        <div class="grid-scroll">
            <div class="item p-2" v-for="(d, index) in data" :key="index">
                <ion-label>{{ t(d.label) }}</ion-label>
                <ion-text :style="{ color: (d.indicator || 'blue') }">
                    <h5 class="m-1"> 
                        <template v-if="d.datatype == 'Currency'">
                            <ComCurrency :value="d.value" />
                        </template>
                        <template v-else-if="d.datatype == 'Float'">
                            <ComNumber :value="d.value" />
                        </template>
                        <span v-else>
                            {{ d.value }}
                        </span>
                    </h5>
                </ion-text>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    data: Object
})
const t = window.t;

</script>
<style scoped>
.grid-scroll-container {
  overflow-x: auto;
  padding: 10px;
}

.grid-scroll {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(2, 66px);
  grid-auto-columns: minmax(170px, 25%);
  gap: 10px;
}

.item { 
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-weight: bold; 
    text-align: center;
    flex-direction: column; 
    height: fit-content;
}

</style>