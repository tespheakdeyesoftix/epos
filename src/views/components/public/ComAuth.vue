<template>
    <BaseModal :title="t(title || 'Enter Pin Codee')" @onConfirm="onConfirm">
            <com-input  style="font-size: 32px;  text-align: center;" type="password"  focus @keyup="onInput" v-model="numberInput"   :placeholder="title" class="my-2"/> 
        <ion-grid class="ion-no-padding">
                <ion-row v-for="r in keypad">
                    <ion-col v-for="k in r" class="px-2 py-2">
                        <ion-button shape="round"  
                         @click="onKeyPadClick(k)" size="large"
                          expand="full" :color="k==t('Clear')?'danger':'light'">
                            {{ k }}
                        </ion-button>
                    </ion-col>
                </ion-row>
        </ion-grid>
    </BaseModal>
</template>
<script setup>

import { modalController } from '@ionic/vue';
import { ref } from 'vue';
 const t = window.t;
const props = defineProps({
    title: String
})
const numberInput = ref("")

 const keypad = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [0,'.',t('Clear')],
    ]
function onKeyPadClick(key){

        if(key=="Clear"){
            numberInput.value = ""

            return;
        }
        if(key=='.'){
            
           if(numberInput.value.toString().includes(".")){
            return
           }
             numberInput.value=numberInput.value.toString() + '.'
            return;
        }
 
        numberInput.value=numberInput.value.toString() + key
    }
    
function onInput(event){
        if(event.key=="."){
            const dotCount = (numberInput.value.match(/\./g) || []).length
            if (dotCount > 1) {
                
                numberInput.value = numberInput.value.slice(0, -1)
            }
        }
    }

async function onConfirm(){
    if(!numberInput.value){
        await app.showWarning("Please enter your pin code");
        return;
    }
    const loading = await app.showLoading();
    const res = app.getApi("epos_restaurant_2023.api.api.check_username",{
        pin_code:numberInput.toString().trim()
    })
    await loading.dismiss();
    modalController.dismiss(Number(numberInput.value || 0), 'confirm');
}

</script>