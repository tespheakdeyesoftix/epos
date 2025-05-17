<template>
 
  <ion-input v-bind="$attrs" 
                     ref="ionInputRef"
                    :value="model"
                    @ionInput="onInput"
                   >
                   <ion-button v-if="type=='BarcodeScanerInput'" @click="onScanBarcode"  fill="clear" slot="end" aria-label="Show/hide">
                     <ion-icon slot="icon-only" :icon="scan" aria-hidden="true"></ion-icon>
                   </ion-button>
                 </ion-input>
</template>
<script setup>
import { IonIcon } from '@ionic/vue';
import { scan } from 'ionicons/icons';
 import ComScanBarcode from "@/views/components/ComScanBarcode.vue"
import { ref } from 'vue';
const ionInputRef = ref(null)

const props = defineProps({
type:{
   type:String,
   default:"text"
}
})

 

defineOptions({
inheritAttrs: false
})

const model = defineModel();
const t = window.t;
const emit = defineEmits()
defineExpose({
focus: () => {

ionInputRef.value?.$el?.setFocus()
const nativeInput = ionInputRef.value?.$el?.querySelector('input')
nativeInput?.select()
}
})

function onInput($event){
  
 if(props.type === "number"){
  model.value = Number($event.detail.value)
 }else {
  model.value = $event.detail.value
 }
}



async function onScanBarcode() {
  const result = await window.openModal({
    
    component: ComScanBarcode,
    componentProps:{
      title: "Scan Barcode",
    }
  })
  if (result) {
    if(props.type == "number"){
      model.value = Number(result)
    }
    model.value = result
    emit("onBarcodeChange")
  }

}




</script>