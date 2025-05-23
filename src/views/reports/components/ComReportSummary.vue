<template>
    <ion-grid>

        <ion-row>
            <ion-col v-for="(d,index) in data" :key="index">
                <ion-label>{{ t(d.label) }}</ion-label>
                <ion-text :style="{color:(d.indicator || 'blue')}">
                    <h5>
                        
                        <template v-if="d.datatype=='Currency'">
                            <ComCurrency :value="d.value"/>
                        </template>
                        <template v-else-if="d.datatype=='Float'">
                            <ComNumber :value="d.value"/>
                        </template>
                        <span v-else>
                        {{d.value}}
                        </span>
                    </h5>
                </ion-text>
            </ion-col>
        </ion-row>
    </ion-grid>
</template>
<script setup>
const props = defineProps({
    data:Object
})
const t = window.t;

</script>