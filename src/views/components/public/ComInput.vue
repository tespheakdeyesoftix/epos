<template>
 <template v-if="type=='number'" >
  <FloatLabel variant="on">
    <InputNumber inputId="on_label" :placeholder="placeholder" v-model="model"    :minFractionDigits="minFractionDigits"  fluid />
    <label for="on_label">{{ label }}</label>
</FloatLabel>
 
  
 </template>
 <template  v-else>
  <ion-input  v-bind="$attrs" 
                     ref="ionInputRef"
                    :value="model"
                    @ionInput="onInput"
                   >
                   <ion-button v-if="type=='BarcodeScanerInput'" @click="onScanBarcode"  fill="clear" slot="end" aria-label="Show/hide">
                     <ion-icon slot="icon-only" :icon="scan" aria-hidden="true"></ion-icon>
                   </ion-button>
                 </ion-input>
                </template>
</template>
<script setup>
import { IonIcon } from '@ionic/vue';
import { scan } from 'ionicons/icons';
 import ComScanBarcode from "@/views/components/ComScanBarcode.vue"
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import FloatLabel from 'primevue/floatlabel';
const ionInputRef = ref(null)


const props = defineProps({
  label:String,
  placeholder:String,
  minFractionDigits:{
    type:Number,
    default:0
  },
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