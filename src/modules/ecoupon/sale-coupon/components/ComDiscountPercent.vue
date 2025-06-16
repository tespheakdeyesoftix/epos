<template>
    <BaseModal :title="t('Discount Percent')" @onConfirm="onConfirm">
       <div>
        <ion-button @click="onSelectDiscount(d)" :color="selectedDiscount?.name == d.name?'primary':'light'"  class="mx-2 my-2" color="light" v-for="d in discountCodes">{{ 
            d.discount_code
            }}</ion-button>
        </div>
        <div class="mt-4">
        <com-input  v-model="note" storageKey="sale_product_discount" type="text-area" :label="t('Discout Note')" />
        </div>
    </BaseModal>
</template>
<script setup>
import { ref } from 'vue';

import { modalController } from '@ionic/vue';
const props = defineProps({
    checkRequireNoteKey:String
})

const t = window.t;
const discountCodes = ref(app.currentUser.pos_permission.discount_codes.filter(x=>x.discount_type == 'Percent'))
const note = ref("")

const selectedDiscount = ref()

function onSelectDiscount(d){
    selectedDiscount.value = d;
}

async function onConfirm(){
    if(!selectedDiscount.value){
        await app.showWarning("Please select discount.")
        return;;
    }

    if(props.checkRequireNoteKey){
 if(app.setting.pos_config[props.checkRequireNoteKey]==1){
        if(!note.value){
            await app.showWarning("Please enter note");
            return;
        }
    }
    }
   

modalController.dismiss({
    discount:selectedDiscount.value.discount_value,
    note:note.value
}, 'confirm');


    
}

</script>