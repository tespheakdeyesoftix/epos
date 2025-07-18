<template><ion-page>
    <AppBar>
        {{t("Setting")}}
    </AppBar>
    <ion-content>
        <div class="fixed-container">
             <ion-text><h3>{{ t("Print Setting") }}</h3></ion-text>
             <ion-list>
    <ion-item>
       
      <ion-select @ionChange="onChangeDefaultPrinter" v-model="default_printer" :label="t('Default Printer')" :placeholder="t('Default Printer')">
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
const default_printer = ref("")
async function onChangeDefaultPrinter(){
    await app.storageService.setItem("default_printer",default_printer.value)
}
onMounted(async ()=>{
    const p = await app.printing.getPrinterNames()
    printers.value = p
    const printer = await app.storageService.getItem("default_printer")
    default_printer.value = printer || "";

})

</script>