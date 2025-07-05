<template><ion-page>
    <AppBar>
        {{t("Setting")}}
    </AppBar>
    <ion-content>
        <div class="fixed-container">
             <ion-text><h3>{{ t("Print Setting") }}</h3></ion-text>
             <ion-list>
    <ion-item>
        {{ cashierShiftPrinter }}
      <ion-select @ionChange="onChangeCashierShiftPrinter" v-model="cashierShiftPrinter" :label="t('Cashier Shift Default Printer')" :placeholder="t('Default Printer')">
        <ion-select-option v-for="p in printers" :value="p.type">{{ p.type }}</ion-select-option>
       
      </ion-select>
    </ion-item>
    </ion-list>
        </div>
    </ion-content>
</ion-page>

</template>

<script setup>
import { onMounted, ref } from 'vue';

const t = window.t;
const printers = ref()
const cashierShiftPrinter = ref("")
async function onChangeCashierShiftPrinter(){
    await app.storageService.setItem("cashierShiftPrinter",cashierShiftPrinter.value)
}
onMounted(async ()=>{
    const p = await app.printing.getPrinterNames()
    printers.value = p
    const shiftPrinter = await app.storageService.getItem("cashierShiftPrinter")
    cashierShiftPrinter.value = shiftPrinter || "";

})

</script>