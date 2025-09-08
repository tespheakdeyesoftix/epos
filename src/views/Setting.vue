<template><ion-page>
    <ToolBar v-if="isModal==1">
        {{t("Setting")}}
    
    </ToolBar>    
    <AppBar v-else>
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

                      <ion-list-header>
      <ion-label>{{ t("Min/Max Selling Coupon Amount") }}</ion-label>
    </ion-list-header>

      <ion-item>
      <ion-input v-model="minAmountKHR" :label="t('Min Amount (KHR)')" type="number" ></ion-input>
    </ion-item>
    
      <ion-item>
      <ion-input v-model="maxAmountKHR" :label="t('Max Amount (KHR)')" type="number"></ion-input>
    </ion-item>
      <ion-item>
      <ion-input v-model="minAmountUSD" :label="t('Min Amount (USD)')" type="number"></ion-input>
 
    </ion-item>
      <ion-item>
      <ion-input v-model="maxAmountUSD" :label="t('Max Amount (USD)')" type="number"></ion-input>
    </ion-item>




    </ion-list>
        </div>
    </ion-content>
    <ion-footer>
        <ion-toolbar>
            <div style=" display: flex;justify-content: center;gap: 10px;">

                <ion-button @click="onSave">{{ t("Save") }}</ion-button>
            
            </div>
            
        </ion-toolbar>
    </ion-footer>
</ion-page>

</template>

<script setup>
import { onMounted, ref } from 'vue';

const t = window.t;
const printers = ref()
const default_printer = ref("")
const isModal = ref(app.route.query.modal)
const minAmountKHR = ref(500)
const maxAmountKHR = ref(100000)

const minAmountUSD = ref(1)
const maxAmountUSD = ref(100)


async function onChangeDefaultPrinter(){
    await app.storageService.setItem("default_printer",default_printer.value)
}


function onSave(){
    if (!minAmountKHR.value){
        minAmountKHR.value = 500
      
    }
    
    if (!maxAmountKHR.value){
        maxAmountKHR.value = 100000
      
    }
    
    if (!minAmountUSD.value){
        minAmountUSD.value = 1
      
    }
    if (!maxAmountUSD.value){
        maxAmountUSD.value = 100
      
    }
 

    app.storageService.setItem("min_amount_khr", minAmountKHR.value)
    app.storageService.setItem("max_amount_khr", maxAmountKHR.value)
    app.storageService.setItem("min_amount_usd", minAmountUSD.value)
    app.storageService.setItem("max_amount_usd", maxAmountUSD.value)
    app.showSuccess("Update successfully")
}

onMounted(async ()=>{
    const p = await app.printing.getPrinterNames()
    printers.value = p
    const printer = await app.storageService.getItem("default_printer")
    default_printer.value = printer || "";

})

</script>