<template>
    
    <stack row equal v-if="plateform=='mobile'">
        <ion-button @click="onCloseSale(true)" expand="full" shape="round" color="success"  >
                        <ion-icon  :icon="printOutline"></ion-icon>
                        {{ t("Payment with Print") }}
                    </ion-button>
                    
                    <ion-button expand="full" shape="round" @click="onCloseSale(true)">
                        <ion-icon  :icon="logoUsd"></ion-icon>
                        {{ t("Payment") }}
                    </ion-button>
    </stack>
    <ion-grid v-else>
        <ion-row>
            <ion-col>
              
                <ion-chip  @click="onSelectPrintFormat(p)" v-for="p in printFormat" :color="p.name==selected?'danger':''">
                  {{ t(p.title) }}
                </ion-chip>
            </ion-col>
            <ion-col></ion-col>
            <ion-col>
                <stack row equal>
                    <ion-button @click="onCloseSale(true)" expand="full" shape="round" color="success" >
                        <ion-icon  :icon="printOutline"></ion-icon>
                        {{ t("Payment with Print") }}
                    </ion-button>
                    
                    <ion-button expand="full" shape="round" @click="onCloseSale(false)">
                        <ion-icon  :icon="logoUsd"></ion-icon>
                        {{ t("Payment") }}
                    </ion-button>

                </stack>
            </ion-col>
        </ion-row>
    </ion-grid>

    
</template>
<script setup>
import { logoUsd, printOutline } from 'ionicons/icons';

import { useSaleCoupon } from "@/hooks/useSaleCoupon.js"
import { ref } from 'vue';
const {  onCloseSale ,selectedPrintFormat} = useSaleCoupon()
const t = window.t;   
const printFormat = app.setting.print_formats.filter(x=>x.show_in_pos==1 && x.doc_type==="Sale");
const selected = ref(app.setting.pos_profile.default_pos_receipt)
selectedPrintFormat.value = app.setting.print_formats.find(x=>x.name == selected.value)

function onSelectPrintFormat(p){
    selected.value = p.name;
    selectedPrintFormat.value = app.setting.print_formats.find(x=>x.name == p.name)
}

const plateform = ref(app.utils.getPlateform())
</script>