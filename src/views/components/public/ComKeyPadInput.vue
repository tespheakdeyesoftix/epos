<template>

            <com-input focus @keyup="onInput" v-model="numberInput"  readonly  :placeholder="t(title || 'Enter Amount')" clear class="my-2"/> 
        <ion-grid class="ion-no-padding">
                <ion-row v-for="r in keypad">
                    <ion-col v-for="k in r" class="px-2 py-2">
                        <ion-button shape="round"  
                         @click="onKeyPadClick(k)" size="large"
                          expand="full" :color="k=='Clear'?'danger':'light'">
                            {{ t(k) }}
                        </ion-button>
                    </ion-col>
                </ion-row>
        </ion-grid>
</template>
<script setup>

import { ref } from 'vue';
 const t = window.t;
const emit = defineEmits()
const numberInput = ref("")
const model = defineModel();

 const keypad = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [0,'.','Clear'],
    ]
function onKeyPadClick(key){
   
        if(key=="Clear"){
            numberInput.value = ""
   emit("onChange",0)
         model.value =0
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

         emit("onChange",Number(numberInput.value || 0))
         model.value = Number(numberInput.value || 0)
    }
    
function onInput(event){
        if(event.key=="."){
            const dotCount = (numberInput.value.match(/\./g) || []).length
            if (dotCount > 1) {
                
                numberInput.value = numberInput.value.slice(0, -1)
            }
        }
    }



</script>