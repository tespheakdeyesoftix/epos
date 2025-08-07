<template>
    
<ion-chip v-if="printFormat.length <= 1">{{ selectedPrintFormat?.title }}</ion-chip>
<template v-else>
    <ComPopOver>
        <ion-chip >{{ selectedPrintFormat?.title }}</ion-chip>
        <template #content>
            <ion-list>
                <ion-item v-for="f in printFormat" lines="full" @click="onSelectPrintFormat(f)">
                    <ion-icon :color="f.name == selectedPrintFormat.name?'success':''" :icon="checkmarkCircleOutline" slot="start"/>
                    <ion-label>{{ f.title }}</ion-label>
                </ion-item>
            </ion-list>
        </template>
    </ComPopOver>
</template>
    </template>

    <script setup>
import { ref } from 'vue';

import { useSaleCoupon } from '@/hooks/useSaleCoupon';
import { checkmarkCircle, checkmarkCircleOutline } from 'ionicons/icons';
    const {  selectedPrintFormat} = useSaleCoupon()
const printFormat = app.setting.print_formats.filter(x=>x.show_in_pos==1 && x.doc_type==="Sale");
const selected = ref(app.setting.pos_profile.default_pos_receipt)
selectedPrintFormat.value = app.setting.print_formats.find(x=>x.name == selected.value)
function onSelectPrintFormat(f){
    selectedPrintFormat.value = f
}
</script>