<template>
    <BaseModal :title="t('Select Printer')">
        <ion-list>
            <ion-item button v-for="(p, index) in printers" :key="index" @click="onSelectPrinter(p)">
                <ion-lalbel>{{ p.type }}</ion-lalbel>
            </ion-item>
        </ion-list>
    </BaseModal>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { modalController } from "@ionic/vue"
    const t= window.t;
    const printers = ref()
function onSelectPrinter(p){
modalController.dismiss(p.type, 'confirm')
}
    onMounted(async ()=>{
        const p = await app.printing.getPrinterNames();
        printers.value = p;
    })
</script>